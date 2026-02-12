<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  currentQuestion: { type: Object, required: true },
  currentChapter: { type: Object, required: true },
  chapterProgress: { type: Number, required: true },
  overallProgress: { type: Number, required: true },
  answeredCount: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: { type: Object, required: true },
  questionIndex: { type: Number, required: true },
  isFinalQuestion: { type: Boolean, default: false }
});

const emit = defineEmits(['select', 'previous', 'next']);

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const currentSelectedIndex = computed(() => {
  if (!props.currentQuestion) return null;
  const selected = props.answers[props.currentQuestion.id];
  return selected === undefined ? null : selected;
});

const canProceedNext = computed(() => currentSelectedIndex.value !== null);

const isAutoAdvancing = ref(false);

function handleSelect(optionIndex) {
  emit('select', optionIndex);
  if (!props.isFinalQuestion && !isAutoAdvancing.value) {
    isAutoAdvancing.value = true;
    setTimeout(() => {
      emit('next');
      isAutoAdvancing.value = false;
    }, 200);
  }
}
</script>

<template>
  <div>
    <!-- Progress Section -->
    <div class="px-5 pt-5 pb-4 space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs text-silver font-sans">总进度 {{ answeredCount }}/{{ totalQuestions }}</span>
        <span class="text-xs font-medium text-gold font-sans">{{ overallProgress }}%</span>
      </div>
      <div class="h-1 w-full overflow-hidden bg-smoke">
        <div
          class="h-full transition-all duration-300"
          :style="{
            width: `${overallProgress}%`,
            background: 'linear-gradient(90deg, #4A8B6E 0%, #C9A962 60%, #D4553A 100%)'
          }"
        />
      </div>
    </div>

    <!-- Chapter Info -->
    <div class="px-5 pb-4">
      <div class="flex items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-[11px] font-medium tracking-[1px] text-gold/50 font-sans">{{ currentChapter?.title }}</p>
          <p class="text-xs text-silver font-sans">{{ currentChapter?.subtitle }}</p>
        </div>
        <div class="bg-ash px-2.5 py-1">
          <span class="text-[11px] text-pearl font-sans">篇章 {{ chapterProgress }}/{{ currentChapter?.questionIds.length }}</span>
        </div>
      </div>
    </div>

    <div class="h-px w-full bg-ash"></div>

    <!-- Question Content -->
    <div class="space-y-5 px-5 py-5">
      <h2 class="font-title text-[22px] font-medium leading-[1.4] text-paper">
        {{ currentQuestion.title }}
      </h2>

      <!-- Options -->
      <div class="space-y-2.5">
        <button
          v-for="(option, optionIndex) in currentQuestion.options"
          :key="`${currentQuestion.id}-${option.label}`"
          class="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm transition"
          :class="
            currentSelectedIndex === optionIndex
              ? 'bg-gold/[0.09] border border-gold/[0.38]'
              : 'bg-charcoal border border-transparent'
          "
          @click="handleSelect(optionIndex)"
        >
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center text-xs font-medium transition"
            :class="
              currentSelectedIndex === optionIndex
                ? 'bg-gold text-void font-semibold'
                : 'border border-smoke text-pearl'
            "
          >
            {{ LETTERS[optionIndex] }}
          </span>
          <span
            class="flex-1 font-sans"
            :class="currentSelectedIndex === optionIndex ? 'text-paper font-medium' : 'text-paper'"
          >
            {{ option.text }}
          </span>
        </button>
      </div>

      <!-- Navigation -->
      <div class="flex items-center gap-3">
        <button
          class="flex h-12 flex-1 items-center justify-center border border-smoke text-sm text-pearl transition hover:border-pearl/30 disabled:opacity-30 disabled:cursor-not-allowed font-sans"
          :disabled="questionIndex === 0"
          @click="emit('previous')"
        >
          上一题
        </button>
        <button
          class="flex h-12 flex-1 items-center justify-center bg-gold text-sm font-semibold text-void transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed font-sans"
          :disabled="!canProceedNext"
          @click="emit('next')"
        >
          {{ isFinalQuestion ? '生成报告' : '下一题' }}
        </button>
      </div>
    </div>
  </div>
</template>
