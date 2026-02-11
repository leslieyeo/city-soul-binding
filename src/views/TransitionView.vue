<script setup>
const props = defineProps({
  chapter: {
    type: Object,
    required: true
  },
  answeredCount: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['continue']);
</script>

<template>
  <section class="flex min-h-[52vh] items-center justify-center rounded-3xl border border-white/15 bg-white/[0.05] p-6 text-center shadow-card">
    <div class="max-w-xl">
      <p class="text-xs uppercase tracking-[0.24em] text-amber/80">Transition</p>
      <h2 class="mt-3 font-title text-3xl text-paper sm:text-4xl">{{ chapter.title }}</h2>
      <p class="mt-5 text-lg leading-relaxed text-paper/90">
        {{ chapter.transitionText || '阶段解析完成，继续下一篇章。' }}
      </p>
      <p class="mt-4 text-sm text-mist">五行能量已记录 {{ answeredCount }} / {{ totalQuestions }}</p>
      <button class="btn-primary mt-7" @click="emit('continue')">继续下一篇章</button>
    </div>
  </section>
</template>
