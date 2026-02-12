<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { chapters, questions } from './data/questions';
import {
  computeBaziProfile,
  getConstellation,
  getConstellationBonusText,
  getConstellationVector,
  getStemElement
} from './utils/astrology';
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
import { STAGES, STORAGE_KEY } from './config/constants';
import ProfileView from './views/ProfileView.vue';
import QuizView from './views/QuizView.vue';
import ReportView from './views/ReportView.vue';

const questionLookup = new Map(questions.map((item) => [item.id, item]));
const orderedQuestions = chapters.flatMap((chapter) =>
  chapter.questionIds.map((id) => questionLookup.get(id)).filter(Boolean)
);
const TOTAL_QUESTIONS = orderedQuestions.length;

// State
const stage = ref(STAGES.PROFILE);

const profile = reactive({
  name: '',
  birthDate: '',
  hourBranch: 'unknown',
  gender: ''
});

const answers = reactive({});
const currentQuestionIndex = ref(0);

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
const hydrated = ref(false);

// Computed
const currentQuestion = computed(() => orderedQuestions[currentQuestionIndex.value] || null);
const currentChapter = computed(() =>
  chapters.find((chapter) => chapter.id === currentQuestion.value?.chapter) || null
);

const chapterQuestionProgress = computed(() => {
  if (!currentQuestion.value || !currentChapter.value) return 0;
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

const isFinalQuestion = computed(() => currentQuestionIndex.value === TOTAL_QUESTIONS - 1);

const profilePreview = computed(() => {
  const birth = parseBirthDate(profile.birthDate);
  if (!birth) return null;

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

// Helper Functions
function parseBirthDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  )
    return null;
  return { year, month, day };
}

function firstUnansweredIndex() {
  const index = orderedQuestions.findIndex((question) => {
    const selected = answers[question.id];
    return selected === undefined || selected === null;
  });
  return index === -1 ? TOTAL_QUESTIONS - 1 : index;
}

// Action Handlers
function onSubmitProfile() {
  if (answeredCount.value >= TOTAL_QUESTIONS && report.value) {
    stage.value = STAGES.REPORT;
    return;
  }
  currentQuestionIndex.value = firstUnansweredIndex();
  stage.value = STAGES.QUIZ;
}

function onSelectAnswer(optionIndex) {
  if (!currentQuestion.value) return;
  answers[currentQuestion.value.id] = optionIndex;
}

function onPreviousQuestion() {
  if (currentQuestionIndex.value <= 0) return;
  currentQuestionIndex.value -= 1;
}

function onNextQuestion() {
  if (isFinalQuestion.value) {
    startCalculationFlow();
    return;
  }
  currentQuestionIndex.value += 1;
}

// Calculation Logic
function buildReportPayload() {
  const birth = parseBirthDate(profile.birthDate);
  if (!birth) return null;

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
  if (!mainCity) return null;

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
  if (!payload) return;

  report.value = payload;
  stage.value = STAGES.CALCULATING;
  calculationPhaseIndex.value = 0;

  calculationPhases.value[calculationPhases.value.length - 1] = `锁定！你的灵魂之城：${payload.mainCity.name}`;

  clearCalculationTimer();
  calculationTimer = window.setInterval(() => {
    if (calculationPhaseIndex.value >= calculationPhases.value.length - 1) {
      clearCalculationTimer();
      stage.value = STAGES.REPORT;
      return;
    }
    calculationPhaseIndex.value += 1;
  }, 800);
}

function clearCalculationTimer() {
  if (calculationTimer) {
    window.clearInterval(calculationTimer);
    calculationTimer = null;
  }
}

// Persistence & Lifecycle
function resetState() {
  clearCalculationTimer();
  stage.value = STAGES.PROFILE;

  profile.name = '';
  profile.birthDate = '';
  profile.hourBranch = 'unknown';
  profile.gender = '';

  Object.keys(answers).forEach((key) => delete answers[key]);
  currentQuestionIndex.value = 0;
  report.value = null;

  localStorage.removeItem(STORAGE_KEY);
}

function persistProgress() {
  const payload = {
    version: 1,
    stage: stage.value === STAGES.CALCULATING ? STAGES.QUIZ : stage.value,
    profile: { ...profile },
    answers: { ...answers },
    currentQuestionIndex: currentQuestionIndex.value,
    report: report.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restoreProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);

    profile.name = saved.profile?.name || '';
    profile.birthDate = saved.profile?.birthDate || '';
    profile.hourBranch = saved.profile?.hourBranch || 'unknown';
    profile.gender = saved.profile?.gender || '';

    Object.keys(answers).forEach((key) => delete answers[key]);
    if (saved.answers && typeof saved.answers === 'object') {
      Object.entries(saved.answers).forEach(([qId, val]) => {
        const n = Number(val);
        if (Number.isInteger(n) && n >= 0 && n <= 4) answers[qId] = n;
      });
    }

    if (Number.isInteger(saved.currentQuestionIndex)) {
      currentQuestionIndex.value = Math.min(
        Math.max(saved.currentQuestionIndex, 0),
        TOTAL_QUESTIONS - 1
      );
    }
    if (saved.report && saved.report.mainCity) {
      report.value = saved.report;
    }

    let nextStage = saved.stage;
    const validStages = [STAGES.PROFILE, STAGES.QUIZ, STAGES.REPORT];
    if (!validStages.includes(nextStage)) nextStage = STAGES.PROFILE;

    const completedAll = answeredCount.value >= TOTAL_QUESTIONS;
    if (profile.name.length === 0 || !profile.birthDate) {
      nextStage = STAGES.PROFILE;
    } else if (completedAll) {
      const savedCreatedAt = report.value?.createdAt;
      report.value = buildReportPayload() || report.value;
      if (report.value && savedCreatedAt) report.value.createdAt = savedCreatedAt;
      nextStage = STAGES.REPORT;
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

watch(
  () => ({
    stage: stage.value,
    profile: { ...profile },
    answers: { ...answers },
    currentQuestionIndex: currentQuestionIndex.value,
    report: report.value
  }),
  () => {
    if (!hydrated.value) return;
    persistProgress();
  },
  { deep: true }
);

function handleBeforeUnload() {
  persistProgress();
}

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
  <main class="min-h-screen">
    <div class="mx-auto w-full max-w-[390px] py-5">
      <ProfileView
        v-if="stage === STAGES.PROFILE"
        v-model:profile="profile"
        :preview="profilePreview"
        @submit="onSubmitProfile"
      />

      <QuizView
        v-else-if="stage === STAGES.QUIZ && currentQuestion"
        :current-question="currentQuestion"
        :current-chapter="currentChapter"
        :chapter-progress="chapterQuestionProgress"
        :overall-progress="overallProgress"
        :answered-count="answeredCount"
        :total-questions="TOTAL_QUESTIONS"
        :answers="answers"
        :question-index="currentQuestionIndex"
        :is-final-question="isFinalQuestion"
        @select="onSelectAnswer"
        @previous="onPreviousQuestion"
        @next="onNextQuestion"
      />

      <!-- Calculating (inline) -->
      <div
        v-else-if="stage === STAGES.CALCULATING"
        class="flex min-h-[80vh] items-center justify-center px-5 py-10"
      >
        <div class="w-full space-y-6 text-center">
          <p class="text-[10px] uppercase tracking-[4px] text-gold/50 font-sans">SOUL ENGINE</p>
          <h2 class="font-title text-[28px] font-semibold leading-[1.3] text-paper">
            正在生成你的<br />城市灵魂报告
          </h2>

          <!-- Orb animation -->
          <div class="relative mx-auto h-[120px] w-[120px]">
            <div class="absolute inset-0 rounded-full border border-gold/25 animate-runeSpin"></div>
            <div class="absolute inset-4 rounded-full border border-jade/25 animate-runeSpin [animation-direction:reverse]"></div>
            <div class="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold animate-shine"></div>
          </div>

          <!-- Phases -->
          <div class="mx-auto w-full max-w-sm space-y-2">
            <div
              v-for="(item, idx) in calculationPhases"
              :key="item"
              class="flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition font-sans"
              :class="
                idx === calculationPhaseIndex
                  ? 'border border-gold/50 bg-gold/[0.08] text-paper'
                  : idx < calculationPhaseIndex
                  ? 'border border-jade/40 bg-jade/[0.09] text-pearl'
                  : 'border border-transparent text-fog'
              "
            >
              <span class="flex w-4 items-center justify-center text-xs">
                <template v-if="idx < calculationPhaseIndex">
                  <span class="text-jade">✓</span>
                </template>
                <template v-else-if="idx === calculationPhaseIndex">
                  <span class="text-gold">➤</span>
                </template>
              </span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <ReportView
        v-else-if="stage === STAGES.REPORT && report"
        :report="report"
        :profile="profile"
        @retest="resetState"
      />
    </div>
  </main>
</template>
