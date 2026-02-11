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

import { STAGES, STORAGE_KEY, STAGE_LABELS } from './config/constants';
import AuthView from './views/AuthView.vue';
import ProfileView from './views/ProfileView.vue';
import QuizView from './views/QuizView.vue';
import TransitionView from './views/TransitionView.vue';
import ReportView from './views/ReportView.vue';

const questionLookup = new Map(questions.map((item) => [item.id, item]));
const orderedQuestions = chapters
  .flatMap((chapter) => chapter.questionIds.map((id) => questionLookup.get(id)).filter(Boolean));
const TOTAL_QUESTIONS = orderedQuestions.length;

// --- State ---
const stage = ref(STAGES.AUTH);
const authPassed = ref(false);
const authorizedCode = ref('');
const authCodeInput = ref(''); // Keep track for persistence persistence restoring

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
const hydrated = ref(false);

// --- Computed ---
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

const transitionChapter = computed(() =>
  chapters.find((chapter) => chapter.id === transitionChapterId.value) || null
);

const stageLabel = computed(() => STAGE_LABELS[stage.value] || '城市灵魂绑定');

// --- Helper Functions ---
function parseBirthDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) return null;
  return { year, month, day };
}

function firstUnansweredIndex() {
  const index = orderedQuestions.findIndex((question) => {
    const selected = answers[question.id];
    return selected === undefined || selected === null;
  });
  return index === -1 ? TOTAL_QUESTIONS - 1 : index;
}

// --- Action Handlers ---

function onAuthSuccess({ code, input }) {
  authPassed.value = true;
  authorizedCode.value = code;
  authCodeInput.value = input;
  stage.value = STAGES.PROFILE;
}

function onSubmitProfile() {
  stage.value = STAGES.QUIZ;
  transitionChapterId.value = null;

  if (answeredCount.value >= TOTAL_QUESTIONS && report.value) {
    stage.value = STAGES.REPORT;
    return;
  }
  currentQuestionIndex.value = firstUnansweredIndex();
}

function onSelectAnswer(optionIndex) {
  if (!currentQuestion.value) return;
  answers[currentQuestion.value.id] = optionIndex;
}

function onPreviousQuestion() {
  if (currentQuestionIndex.value <= 0) return;
  stage.value = STAGES.QUIZ;
  transitionChapterId.value = null;
  currentQuestionIndex.value -= 1;
}

function onNextQuestion() {
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

function onContinueTransition() {
  stage.value = STAGES.QUIZ;
  transitionChapterId.value = null;
}

// --- Calculation Logic ---

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
  transitionChapterId.value = null;
  calculationPhaseIndex.value = 0;
  
  // Update last phase with dynamic city name
  calculationPhases.value[calculationPhases.value.length - 1] = `锁定！你的灵魂之城：${payload.mainCity.name}`;

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

function clearCalculationTimer() {
  if (calculationTimer) {
    window.clearInterval(calculationTimer);
    calculationTimer = null;
  }
}

// --- Persistence & Lifecycle ---

function resetState() {
  clearCalculationTimer();
  stage.value = STAGES.AUTH;
  authCodeInput.value = '';
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

  localStorage.removeItem(STORAGE_KEY);
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
  if (!raw) return;

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
      Object.entries(saved.answers).forEach(([qId, val]) => {
        const n = Number(val);
        if (Number.isInteger(n) && n >= 0 && n <= 4) answers[qId] = n;
      });
    }

    if (Number.isInteger(saved.currentQuestionIndex)) {
      currentQuestionIndex.value = Math.min(Math.max(saved.currentQuestionIndex, 0), TOTAL_QUESTIONS - 1);
    }
    if (Number.isInteger(saved.transitionChapterId)) {
      transitionChapterId.value = saved.transitionChapterId;
    }
    if (saved.report && saved.report.mainCity) {
      report.value = saved.report;
    }

    // Determine Stage
    let nextStage = saved.stage;
    const validStages = [STAGES.AUTH, STAGES.PROFILE, STAGES.QUIZ, STAGES.TRANSITION, STAGES.REPORT];
    if (!validStages.includes(nextStage)) nextStage = STAGES.AUTH;

    const completedAll = answeredCount.value >= TOTAL_QUESTIONS;
    if (!authPassed.value) {
      nextStage = STAGES.AUTH;
    } else if (!canStartQuiz.value) { 
      // Reuse logic from ProfileView but check data directly
      if(profile.name.length === 0 || !profile.birthDate) nextStage = STAGES.PROFILE;
    } else if (completedAll) {
      if (!report.value) report.value = buildReportPayload();
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

// CanStartQuiz check for restore logic redundancy
const canStartQuiz = computed(() => {
   return profile.name.trim().length > 0 && Boolean(parseBirthDate(profile.birthDate));
});


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

      <!-- Stage Views -->
      <AuthView 
        v-if="stage === STAGES.AUTH" 
        :initial-code="authCodeInput" 
        @auth-success="onAuthSuccess" 
      />

      <ProfileView 
        v-else-if="stage === STAGES.PROFILE" 
        v-model:profile="profile" 
        :preview="profilePreview" 
        @submit="onSubmitProfile" 
      />

      <TransitionView
        v-else-if="stage === STAGES.TRANSITION"
        :chapter="transitionChapter"
        :answered-count="answeredCount"
        :total-questions="TOTAL_QUESTIONS"
        @continue="onContinueTransition"
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

      <div
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
                ? 'border-jade/30 bg-jade/10 text-mist'
                : 'border-transparent text-mist/30'
            "
          >
            <span class="mr-2 inline-block w-4 text-center">
              {{ idx < calculationPhaseIndex ? '✓' : idx === calculationPhaseIndex ? '➤' : '' }}
            </span>
            {{ item }}
          </li>
        </ul>
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
