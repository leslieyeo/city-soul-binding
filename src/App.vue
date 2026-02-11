<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import html2canvas from 'html2canvas';
import { chapters, questions } from './data/questions';
import {
  HOUR_OPTIONS,
  computeBaziProfile,
  getConstellation,
  getConstellationBonusText,
  getConstellationVector,
  getStemElement
} from './utils/astrology';
import { normalizeCode, verifyAuthorizationCode } from './utils/auth';
import {
  buildResonanceText,
  computeFinalVector,
  computeQuizVector,
  formatVectorList,
  getHiddenCity,
  getPersonalityKeywords,
  matchCities
} from './utils/calc';
import { ELEMENT_META, getTopElements } from './utils/elements';
import CityPostcardCard from './components/CityPostcardCard.vue';
import FiveElementCard from './components/FiveElementCard.vue';
import CityReportCard from './components/CityReportCard.vue';
import CityTicketCard from './components/CityTicketCard.vue';

const STORAGE_KEY = 'city-soul-binding-progress-v1';

const STAGES = {
  AUTH: 'auth',
  PROFILE: 'profile',
  QUIZ: 'quiz',
  TRANSITION: 'transition',
  CALCULATING: 'calculating',
  REPORT: 'report'
};

const questionLookup = new Map(questions.map((item) => [item.id, item]));
const orderedQuestions = chapters
  .flatMap((chapter) => chapter.questionIds.map((id) => questionLookup.get(id)).filter(Boolean));
const TOTAL_QUESTIONS = orderedQuestions.length;

const stage = ref(STAGES.AUTH);
const authCodeInput = ref('');
const authError = ref('');
const isAuthorizing = ref(false);
const authPassed = ref(false);
const authorizedCode = ref('');

const profile = reactive({
  name: '',
  birthDate: '',
  hourBranch: 'unknown',
  gender: ''
});

const answers = reactive({});
const currentQuestionIndex = ref(0);
const transitionChapterId = ref(null);

const calculationPhases = ref([
  '解析五行天干地支...',
  '匹配星座能量频率...',
  '计算个性维度向量...',
  '扫描 20 座城市共鸣...',
  '锁定！你的灵魂之城...'
]);
const calculationPhaseIndex = ref(0);
let calculationTimer = null;

const report = ref(null);
const saveError = ref('');
const savingCard = ref('');

const postcardCardRef = ref(null);
const fiveElementsCardRef = ref(null);
const cityReportCardRef = ref(null);
const ticketCardRef = ref(null);

const hydrated = ref(false);

const currentQuestion = computed(() => orderedQuestions[currentQuestionIndex.value] || null);
const currentChapter = computed(() =>
  chapters.find((chapter) => chapter.id === currentQuestion.value?.chapter) || null
);

const chapterQuestionProgress = computed(() => {
  if (!currentQuestion.value || !currentChapter.value) {
    return 0;
  }
  return currentChapter.value.questionIds.indexOf(currentQuestion.value.id) + 1;
});

const answeredCount = computed(() =>
  orderedQuestions.reduce((count, question) => {
    const picked = answers[question.id];
    return picked === undefined || picked === null ? count : count + 1;
  }, 0)
);

const overallProgress = computed(() =>
  Number(((answeredCount.value / TOTAL_QUESTIONS) * 100).toFixed(1))
);

const currentSelectedIndex = computed(() => {
  if (!currentQuestion.value) {
    return null;
  }
  const selected = answers[currentQuestion.value.id];
  return selected === undefined ? null : selected;
});

const canProceedNext = computed(() => currentSelectedIndex.value !== null);
const isFinalQuestion = computed(() => currentQuestionIndex.value === TOTAL_QUESTIONS - 1);

const profilePreview = computed(() => {
  const birth = parseBirthDate(profile.birthDate);
  if (!birth) {
    return null;
  }

  const constellation = getConstellation(birth.month, birth.day);
  const bazi = computeBaziProfile({
    year: birth.year,
    month: birth.month,
    day: birth.day,
    hourBranch: profile.hourBranch || 'unknown'
  });
  const dayElement = getStemElement(bazi.dayStem);

  return {
    constellation,
    bazi,
    dayElementCn: ELEMENT_META[dayElement]?.cn || '土'
  };
});

const canStartQuiz = computed(() => {
  return profile.name.trim().length > 0 && Boolean(parseBirthDate(profile.birthDate));
});

const transitionChapter = computed(() =>
  chapters.find((chapter) => chapter.id === transitionChapterId.value) || null
);

const stageLabel = computed(() => {
  const map = {
    [STAGES.AUTH]: '授权验证',
    [STAGES.PROFILE]: '基础信息',
    [STAGES.QUIZ]: '答题中',
    [STAGES.TRANSITION]: '章节过渡',
    [STAGES.CALCULATING]: '计算中',
    [STAGES.REPORT]: '灵魂报告'
  };

  return map[stage.value] || '城市灵魂绑定';
});

const reportDate = computed(() => formatDate(report.value?.createdAt));

function parseBirthDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function formatDate(dateInput) {
  const target = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(target.getTime())) {
    return '--.--.--';
  }

  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function formatCodeInput(value) {
  const compact = normalizeCode(value).replace(/-/g, '').slice(0, 8);
  if (compact.length <= 4) {
    return compact;
  }
  return `${compact.slice(0, 4)}-${compact.slice(4)}`;
}

function handleCodeInput(event) {
  authCodeInput.value = formatCodeInput(event.target.value || '');
  authError.value = '';
}

async function submitAuthorization() {
  authError.value = '';
  const code = formatCodeInput(authCodeInput.value);
  authCodeInput.value = code;

  if (!code) {
    authError.value = '请输入授权码';
    return;
  }

  isAuthorizing.value = true;
  try {
    const result = await verifyAuthorizationCode(code);
    if (!result.valid) {
      authError.value =
        result.reason === 'format'
          ? '授权码格式不正确，示例：SL7K-M2XP'
          : '授权码无效或已损坏，请核对后重试';
      return;
    }

    authPassed.value = true;
    authorizedCode.value = result.code;
    authCodeInput.value = result.code;
    stage.value = STAGES.PROFILE;
  } catch (error) {
    authError.value = '校验失败，请稍后重试';
  } finally {
    isAuthorizing.value = false;
  }
}

function isProfileCompleted() {
  return canStartQuiz.value;
}

function firstUnansweredIndex() {
  const index = orderedQuestions.findIndex((question) => {
    const selected = answers[question.id];
    return selected === undefined || selected === null;
  });

  return index === -1 ? TOTAL_QUESTIONS - 1 : index;
}

function submitProfile() {
  if (!canStartQuiz.value) {
    return;
  }

  stage.value = STAGES.QUIZ;
  transitionChapterId.value = null;

  if (answeredCount.value >= TOTAL_QUESTIONS && report.value) {
    stage.value = STAGES.REPORT;
    return;
  }

  currentQuestionIndex.value = firstUnansweredIndex();
}

function selectOption(optionIndex) {
  if (!currentQuestion.value) {
    return;
  }
  answers[currentQuestion.value.id] = optionIndex;
}

function goPreviousQuestion() {
  if (currentQuestionIndex.value <= 0) {
    return;
  }

  stage.value = STAGES.QUIZ;
  transitionChapterId.value = null;
  currentQuestionIndex.value -= 1;
}

function goNextQuestion() {
  if (!currentQuestion.value || !canProceedNext.value) {
    return;
  }

  if (isFinalQuestion.value) {
    startCalculationFlow();
    return;
  }

  const previousChapter = currentQuestion.value.chapter;
  const nextIndex = currentQuestionIndex.value + 1;
  const nextQuestion = orderedQuestions[nextIndex];

  currentQuestionIndex.value = nextIndex;

  if (nextQuestion?.chapter !== previousChapter) {
    transitionChapterId.value = previousChapter;
    stage.value = STAGES.TRANSITION;
    return;
  }

  stage.value = STAGES.QUIZ;
}

function continueAfterTransition() {
  stage.value = STAGES.QUIZ;
  transitionChapterId.value = null;
}

function clearCalculationTimer() {
  if (calculationTimer) {
    window.clearInterval(calculationTimer);
    calculationTimer = null;
  }
}

function buildReportPayload() {
  const birth = parseBirthDate(profile.birthDate);
  if (!birth) {
    return null;
  }

  const bazi = computeBaziProfile({
    year: birth.year,
    month: birth.month,
    day: birth.day,
    hourBranch: profile.hourBranch || 'unknown'
  });
  const constellation = getConstellation(birth.month, birth.day);
  const quiz = computeQuizVector(answers);
  const constellationVector = getConstellationVector(constellation);
  const finalVector = computeFinalVector({
    innateVector: bazi.vector,
    constellationVector,
    quizVector: quiz.normalized
  });

  const matches = matchCities(finalVector);
  const mainCity = matches[0];
  if (!mainCity) {
    return null;
  }

  const hiddenCity = getHiddenCity(matches);
  const keywords = getPersonalityKeywords(finalVector);
  const [primaryElement, secondaryElement] = getTopElements(finalVector, 2);

  return {
    createdAt: new Date().toISOString(),
    bazi,
    constellation,
    constellationVector,
    quizVector: quiz.normalized,
    finalVector,
    vectorList: formatVectorList(finalVector),
    matches,
    mainCity,
    hiddenCity,
    keywords,
    resonanceText: buildResonanceText({
      userName: profile.name.trim() || '你',
      finalVector,
      city: mainCity
    }),
    primaryElement,
    secondaryElement,
    constellationBonusText: getConstellationBonusText(constellation)
  };
}

function startCalculationFlow() {
  const payload = buildReportPayload();
  if (!payload) {
    return;
  }

  report.value = payload;
  stage.value = STAGES.CALCULATING;
  transitionChapterId.value = null;
  calculationPhaseIndex.value = 0;
  calculationPhases.value = [
    '解析五行天干地支...',
    '匹配星座能量频率...',
    '计算个性维度向量...',
    '扫描 20 座城市共鸣...',
    `锁定！你的灵魂之城：${payload.mainCity.name}`
  ];

  clearCalculationTimer();
  calculationTimer = window.setInterval(() => {
    if (calculationPhaseIndex.value >= calculationPhases.value.length - 1) {
      clearCalculationTimer();
      stage.value = STAGES.REPORT;
      return;
    }

    calculationPhaseIndex.value += 1;
  }, 1200);
}

function sanitizeFileName(value) {
  return (value || 'card').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-');
}

async function saveCardImage(cardKey) {
  saveError.value = '';

  const map = {
    postcard: { node: postcardCardRef.value, label: '城市明信片' },
    elements: { node: fiveElementsCardRef.value, label: '五行图谱' },
    report: { node: cityReportCardRef.value, label: '城市报告' },
    ticket: { node: ticketCardRef.value, label: '城市车票' }
  };

  const target = map[cardKey];
  if (!target?.node) {
    saveError.value = '卡片尚未生成，请稍后重试';
    return;
  }

  try {
    savingCard.value = cardKey;
    const scale = Math.max(2, Math.min(4, window.devicePixelRatio || 2));
    const canvas = await html2canvas(target.node, {
      backgroundColor: null,
      scale,
      useCORS: true
    });

    const link = document.createElement('a');
    const traveler = sanitizeFileName(profile.name.trim() || '灵魂旅人');
    const date = sanitizeFileName(reportDate.value);
    link.download = `${traveler}-${target.label}-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    saveError.value = '保存失败，请稍后重试';
  } finally {
    savingCard.value = '';
  }
}

function resetState() {
  clearCalculationTimer();

  stage.value = STAGES.AUTH;
  authCodeInput.value = '';
  authError.value = '';
  isAuthorizing.value = false;
  authPassed.value = false;
  authorizedCode.value = '';

  profile.name = '';
  profile.birthDate = '';
  profile.hourBranch = 'unknown';
  profile.gender = '';

  Object.keys(answers).forEach((key) => delete answers[key]);
  currentQuestionIndex.value = 0;
  transitionChapterId.value = null;

  report.value = null;
  saveError.value = '';

  localStorage.removeItem(STORAGE_KEY);
}

function handleRetest() {
  const accepted = window.confirm('相同答案 = 相同结果哦，确认清空数据重新开始吗？');
  if (!accepted) {
    return;
  }

  resetState();
}

function persistProgress() {
  const payload = {
    version: 1,
    stage: stage.value === STAGES.CALCULATING ? STAGES.QUIZ : stage.value,
    authPassed: authPassed.value,
    authorizedCode: authorizedCode.value,
    authCodeInput: authCodeInput.value,
    profile: { ...profile },
    answers: { ...answers },
    currentQuestionIndex: currentQuestionIndex.value,
    transitionChapterId: transitionChapterId.value,
    report: report.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restoreProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const saved = JSON.parse(raw);

    authPassed.value = Boolean(saved.authPassed);
    authorizedCode.value = saved.authorizedCode || '';
    authCodeInput.value = saved.authCodeInput || saved.authorizedCode || '';

    profile.name = saved.profile?.name || '';
    profile.birthDate = saved.profile?.birthDate || '';
    profile.hourBranch = saved.profile?.hourBranch || 'unknown';
    profile.gender = saved.profile?.gender || '';

    Object.keys(answers).forEach((key) => delete answers[key]);
    if (saved.answers && typeof saved.answers === 'object') {
      Object.entries(saved.answers).forEach(([questionId, optionIndex]) => {
        const normalized = Number(optionIndex);
        if (Number.isInteger(normalized) && normalized >= 0 && normalized <= 4) {
          answers[questionId] = normalized;
        }
      });
    }

    if (Number.isInteger(saved.currentQuestionIndex)) {
      currentQuestionIndex.value = Math.min(
        Math.max(saved.currentQuestionIndex, 0),
        TOTAL_QUESTIONS - 1
      );
    }

    if (Number.isInteger(saved.transitionChapterId)) {
      transitionChapterId.value = saved.transitionChapterId;
    }

    if (saved.report && saved.report.mainCity) {
      report.value = saved.report;
    }

    let nextStage = saved.stage;
    const validStages = new Set([
      STAGES.AUTH,
      STAGES.PROFILE,
      STAGES.QUIZ,
      STAGES.TRANSITION,
      STAGES.REPORT
    ]);
    if (!validStages.has(nextStage)) {
      nextStage = STAGES.AUTH;
    }

    const completedAll = answeredCount.value >= TOTAL_QUESTIONS;
    if (!authPassed.value) {
      nextStage = STAGES.AUTH;
    } else if (!isProfileCompleted()) {
      nextStage = STAGES.PROFILE;
    } else if (completedAll) {
      if (!report.value) {
        report.value = buildReportPayload();
      }
      nextStage = STAGES.REPORT;
    } else if (nextStage === STAGES.AUTH) {
      nextStage = STAGES.PROFILE;
    }

    if (nextStage === STAGES.TRANSITION && !transitionChapterId.value) {
      nextStage = STAGES.QUIZ;
    }

    if (nextStage === STAGES.QUIZ) {
      const maxSafeIndex = firstUnansweredIndex();
      currentQuestionIndex.value = Math.min(currentQuestionIndex.value, maxSafeIndex);
    }

    stage.value = nextStage;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function handleBeforeUnload() {
  persistProgress();
}

watch(
  () => ({
    stage: stage.value,
    authPassed: authPassed.value,
    authorizedCode: authorizedCode.value,
    authCodeInput: authCodeInput.value,
    profile: { ...profile },
    answers: { ...answers },
    currentQuestionIndex: currentQuestionIndex.value,
    transitionChapterId: transitionChapterId.value,
    report: report.value
  }),
  () => {
    if (!hydrated.value) {
      return;
    }
    persistProgress();
  },
  { deep: true }
);

onMounted(() => {
  restoreProgress();
  hydrated.value = true;
  persistProgress();
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  clearCalculationTimer();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <main class="min-h-screen px-4 py-5 sm:px-6 sm:py-8">
    <div class="mx-auto w-full max-w-4xl">
      <header class="mb-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-card sm:mb-7">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.26em] text-mist/70">City Soul Binding</p>
            <h1 class="mt-2 font-title text-3xl text-paper sm:text-4xl">城市灵魂绑定</h1>
            <p class="mt-2 text-sm text-mist">五行 × 星座 × 个性测试报告</p>
          </div>
          <span class="rounded-full border border-amber/35 bg-amber/10 px-3 py-1 text-xs text-amber">
            {{ stageLabel }}
          </span>
        </div>
      </header>

      <section v-if="stage === STAGES.AUTH" class="card-paper rounded-3xl border border-white/10 p-5 shadow-card sm:p-8">
        <h2 class="font-title text-2xl text-ink">输入授权码</h2>
        <p class="mt-2 text-sm text-[#475169]">请输入 8 位授权码，示例：SL7K-M2XP</p>

        <form class="mt-5 space-y-4" @submit.prevent="submitAuthorization">
          <input
            :value="authCodeInput"
            type="text"
            maxlength="9"
            class="input-shell bg-[#14203e] text-paper placeholder:text-mist/60"
            placeholder="XXXX-XXXX"
            @input="handleCodeInput"
          />

          <p v-if="authError" class="text-sm text-[#d44f2f]">{{ authError }}</p>

          <button type="submit" class="btn-primary w-full" :disabled="isAuthorizing">
            {{ isAuthorizing ? '校验中...' : '开始验证' }}
          </button>
        </form>
      </section>

      <section
        v-else-if="stage === STAGES.PROFILE"
        class="card-paper rounded-3xl border border-white/10 p-5 shadow-card sm:p-8"
      >
        <h2 class="font-title text-2xl text-ink">填写基础信息</h2>
        <p class="mt-2 text-sm text-[#4c5670]">用于生成专属报告展示。姓名和生日为必填项。</p>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <label class="space-y-2 text-sm text-[#3a445b]">
            <span>姓名 *</span>
            <input v-model.trim="profile.name" type="text" class="input-shell bg-[#152141] text-paper" placeholder="例如：林夏" />
          </label>

          <label class="space-y-2 text-sm text-[#3a445b]">
            <span>出生日期 *</span>
            <input v-model="profile.birthDate" type="date" class="input-shell bg-[#152141] text-paper" />
          </label>

          <label class="space-y-2 text-sm text-[#3a445b]">
            <span>出生时辰（可选）</span>
            <select v-model="profile.hourBranch" class="input-shell bg-[#152141] text-paper">
              <option v-for="item in HOUR_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>

          <label class="space-y-2 text-sm text-[#3a445b]">
            <span>性别（可选）</span>
            <select v-model="profile.gender" class="input-shell bg-[#152141] text-paper">
              <option value="">不填写</option>
              <option value="female">女</option>
              <option value="male">男</option>
            </select>
          </label>
        </div>

        <div v-if="profilePreview" class="mt-5 rounded-2xl border border-[#d5dae3] bg-white/70 p-4">
          <p class="text-sm text-[#2d374d]">
            你的星座是 <strong>{{ profilePreview.constellation.name }}</strong>（{{ profilePreview.constellation.astro }}），
            五行日柱为 <strong>{{ profilePreview.bazi.dayPillar }}</strong>（{{ profilePreview.dayElementCn }}）。
          </p>
        </div>

        <button class="btn-primary mt-5 w-full" :disabled="!canStartQuiz" @click="submitProfile">进入 35 题测试</button>
      </section>

      <section v-else-if="stage === STAGES.QUIZ && currentQuestion" class="space-y-4">
        <div class="card-paper rounded-3xl border border-white/10 p-4 shadow-card sm:p-6">
          <div class="flex items-center justify-between text-xs text-[#58627a]">
            <span>总进度 {{ answeredCount }}/{{ TOTAL_QUESTIONS }}</span>
            <span>{{ overallProgress }}%</span>
          </div>
          <div class="mt-2 h-2 rounded-full bg-[#dae0ea]">
            <div
              class="h-full rounded-full bg-gradient-to-r from-jade via-amber to-ember transition-all"
              :style="{ width: `${overallProgress}%` }"
            />
          </div>
        </div>

        <div class="card-paper rounded-3xl border border-white/10 p-5 shadow-card sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[#64708a]">{{ currentChapter?.title }}</p>
              <p class="mt-1 text-sm text-[#5b667f]">{{ currentChapter?.subtitle }}</p>
            </div>
            <span class="rounded-full border border-[#cfd6e1] bg-white px-3 py-1 text-xs text-[#46506a]">
              当前篇章进度 {{ chapterQuestionProgress }}/{{ currentChapter?.questionIds.length }}
            </span>
          </div>

          <h2 class="mt-5 font-title text-2xl leading-tight text-[#1f2739] sm:text-3xl">{{ currentQuestion.title }}</h2>

          <div class="mt-5 space-y-3">
            <button
              v-for="(option, optionIndex) in currentQuestion.options"
              :key="`${currentQuestion.id}-${option.label}`"
              class="w-full rounded-2xl border px-4 py-3 text-left text-sm transition sm:text-[15px]"
              :class="
                currentSelectedIndex === optionIndex
                  ? 'border-[#274b87] bg-[#e8f0ff] text-[#1f3e72]'
                  : 'border-[#d4dbe6] bg-white/75 text-[#33405c] hover:border-[#a8b8d8]'
              "
              @click="selectOption(optionIndex)"
            >
              <span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
                {{ option.label }}
              </span>
              {{ option.text }}
            </button>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3">
            <button class="btn-ghost flex-1" :disabled="currentQuestionIndex === 0" @click="goPreviousQuestion">
              上一题
            </button>
            <button class="btn-primary flex-1" :disabled="!canProceedNext" @click="goNextQuestion">
              {{ isFinalQuestion ? '生成报告' : '下一题' }}
            </button>
          </div>
        </div>
      </section>

      <section
        v-else-if="stage === STAGES.TRANSITION"
        class="flex min-h-[52vh] items-center justify-center rounded-3xl border border-white/15 bg-white/[0.05] p-6 text-center shadow-card"
      >
        <div class="max-w-xl">
          <p class="text-xs uppercase tracking-[0.24em] text-amber/80">Transition</p>
          <h2 class="mt-3 font-title text-3xl text-paper sm:text-4xl">{{ transitionChapter?.title }}</h2>
          <p class="mt-5 text-lg leading-relaxed text-paper/90">
            {{ transitionChapter?.transitionText || '阶段解析完成，继续下一篇章。' }}
          </p>
          <p class="mt-4 text-sm text-mist">五行能量已记录 {{ answeredCount }} / {{ TOTAL_QUESTIONS }}</p>
          <button class="btn-primary mt-7" @click="continueAfterTransition">继续下一篇章</button>
        </div>
      </section>

      <section
        v-else-if="stage === STAGES.CALCULATING"
        class="rounded-3xl border border-white/15 bg-white/[0.04] p-6 text-center shadow-card sm:p-8"
      >
        <p class="text-xs uppercase tracking-[0.26em] text-amber/85">Soul Engine</p>
        <h2 class="mt-3 font-title text-3xl text-paper">正在生成你的城市灵魂报告</h2>

        <div class="relative mx-auto mt-8 h-36 w-36">
          <span class="absolute inset-0 rounded-full border border-amber/40 animate-runeSpin" />
          <span class="absolute inset-4 rounded-full border border-jade/45 animate-runeSpin [animation-direction:reverse]" />
          <span class="absolute inset-0 m-auto h-5 w-5 rounded-full bg-amber animate-shine" />
        </div>

        <ul class="mx-auto mt-8 max-w-md space-y-2 text-left">
          <li
            v-for="(item, idx) in calculationPhases"
            :key="item"
            class="rounded-xl border px-3 py-2 text-sm transition"
            :class="
              idx === calculationPhaseIndex
                ? 'border-amber/70 bg-amber/15 text-paper'
                : idx < calculationPhaseIndex
                  ? 'border-jade/45 bg-jade/10 text-paper/90'
                  : 'border-white/15 bg-white/5 text-mist/75'
            "
          >
            {{ item }}
          </li>
        </ul>
      </section>

      <section
        v-else-if="stage === STAGES.REPORT && report"
        class="space-y-5 rounded-3xl border border-white/15 bg-white/[0.04] p-4 shadow-card sm:p-6"
      >
        <div class="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-[0.22em] text-mist/75">Your Soul City</p>
          <h2 class="mt-2 font-title text-3xl text-paper sm:text-4xl">{{ report.mainCity.name }}</h2>
          <p class="mt-2 text-sm text-paper/90">{{ report.mainCity.soulCopy }}</p>
          <div class="mt-4 flex flex-wrap gap-2 text-xs">
            <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1">匹配度 {{ report.mainCity.similarityPercent }}%</span>
            <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1">{{ report.constellation.name }}</span>
            <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1">日柱 {{ report.bazi.dayPillar }}</span>
          </div>
          <p v-if="report.hiddenCity" class="mt-3 text-sm text-amber">
            你还有一座隐藏城市：{{ report.hiddenCity.city.name }}（分差 {{ report.hiddenCity.gap }}%）
          </p>
        </div>

        <div class="space-y-4">
          <article class="rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4">
            <div ref="postcardCardRef" class="mx-auto w-full max-w-[440px]">
              <CityPostcardCard
                :city="report.mainCity"
                :profile="profile"
                :constellation="report.constellation"
                :bazi="report.bazi"
                :report-date="reportDate"
              />
            </div>
            <button class="btn-primary mt-4 w-full" :disabled="savingCard === 'postcard'" @click="saveCardImage('postcard')">
              {{ savingCard === 'postcard' ? '保存中...' : '保存城市明信片' }}
            </button>
          </article>

          <article class="rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4">
            <div ref="fiveElementsCardRef" class="mx-auto w-full max-w-[440px]">
              <FiveElementCard
                :vector="report.finalVector"
                :primary-element="report.primaryElement"
                :secondary-element="report.secondaryElement"
                :constellation-bonus-text="report.constellationBonusText"
                :keywords="report.keywords"
                :resonance-text="report.resonanceText"
              />
            </div>
            <button class="btn-primary mt-4 w-full" :disabled="savingCard === 'elements'" @click="saveCardImage('elements')">
              {{ savingCard === 'elements' ? '保存中...' : '保存五行图谱' }}
            </button>
          </article>

          <article class="rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4">
            <div ref="cityReportCardRef" class="mx-auto w-full max-w-[440px]">
              <CityReportCard :city="report.mainCity" :hidden-city="report.hiddenCity" />
            </div>
            <button class="btn-primary mt-4 w-full" :disabled="savingCard === 'report'" @click="saveCardImage('report')">
              {{ savingCard === 'report' ? '保存中...' : '保存城市报告' }}
            </button>
          </article>

          <article class="rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4">
            <div ref="ticketCardRef" class="mx-auto w-full max-w-[440px]">
              <CityTicketCard
                :city="report.mainCity"
                :profile="profile"
                :primary-element="report.primaryElement"
                :secondary-element="report.secondaryElement"
                :report-date="reportDate"
              />
            </div>
            <button class="btn-primary mt-4 w-full" :disabled="savingCard === 'ticket'" @click="saveCardImage('ticket')">
              {{ savingCard === 'ticket' ? '保存中...' : '保存城市车票' }}
            </button>
          </article>
        </div>

        <p v-if="saveError" class="rounded-2xl border border-[#d55a39]/50 bg-[#d55a39]/15 px-3 py-2 text-sm text-[#ffd8cf]">
          {{ saveError }}
        </p>

        <div class="rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
          <p class="text-sm text-paper/90">想重新探索？相同答案会得到相同结果。</p>
          <button class="btn-ghost mt-3" @click="handleRetest">清空并重新开始</button>
        </div>
      </section>

      <footer class="mt-6 pb-3 text-center text-xs text-mist/75">本测试仅供娱乐参考</footer>
    </div>
  </main>
</template>
