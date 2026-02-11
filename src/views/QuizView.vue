<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  currentQuestion: {
    type: Object,
    required: true
  },
  currentChapter: {
    type: Object,
    required: true
  },
  chapterProgress: {
    type: Number,
    required: true
  },
  overallProgress: {
    type: Number,
    required: true
  },
  answeredCount: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: {
    type: Object,
    required: true
  },
  questionIndex: {
    type: Number,
    required: true
  },
  isFinalQuestion: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select', 'previous', 'next']);

const currentSelectedIndex = computed(() => {
  if (!props.currentQuestion) return null;
  const selected = props.answers[props.currentQuestion.id];
  return selected === undefined ? null : selected;
});

const canProceedNext = computed(() => currentSelectedIndex.value !== null);

// Auto-advance logic
const isAutoAdvancing = ref(false);

function handleSelect(optionIndex) {
  emit('select', optionIndex);
  
  // Trigger auto-advance if it's not the final question
  if (!props.isFinalQuestion && !isAutoAdvancing.value) {
    isAutoAdvancing.value = true;
    setTimeout(() => {
      emit('next');
      isAutoAdvancing.value = false; // Reset for next interaction
    }, 380); // Small delay for visual feedback
  }
}

// Manual navigation
function handleNext() {
  emit('next');
}

function handlePrevious() {
  emit('previous');
}
</script>

<template>
  <section class="space-y-4">
    <div class="card-paper rounded-3xl border border-white/10 p-4 shadow-card sm:p-6">
      <div class="flex items-center justify-between text-xs text-[#58627a]">
        <span>总进度 {{ answeredCount }}/{{ totalQuestions }}</span>
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
          当前篇章进度 {{ chapterProgress }}/{{ currentChapter?.questionIds.length }}
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
          @click="handleSelect(optionIndex)"
        >
          <span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
            {{ option.label }}
          </span>
          {{ option.text }}
        </button>
      </div>

      <div class="mt-6 flex items-center justify-between gap-3">
        <button class="btn-ghost flex-1" :disabled="questionIndex === 0" @click="handlePrevious">
          上一题
        </button>
        <!-- 'Next' button remains for manual navigation or changing answers, 
             but auto-advance handles main flow.
             Final question requires explicit click to generate report. -->
        <button class="btn-primary flex-1" :disabled="!canProceedNext" @click="handleNext">
          {{ isFinalQuestion ? '生成报告' : '下一题' }}
        </button>
      </div>
    </div>
  </section>
</template>
