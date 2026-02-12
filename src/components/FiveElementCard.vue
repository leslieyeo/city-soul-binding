<script setup>
import { computed } from 'vue';
import RadarChart from './RadarChart.vue';
import { ELEMENT_META } from '../utils/elements';

const props = defineProps({
  report: { type: Object, default: null },
  finalVector: { type: Object, required: true },
  primaryElement: { type: String, required: true },
  secondaryElement: { type: String, required: true },
  constellationBonusText: { type: String, default: '' },
  keywords: { type: Array, default: () => [] },
  resonanceText: { type: String, default: '' }
});

const primaryMeta = computed(() => ELEMENT_META[props.primaryElement] || ELEMENT_META.wood);
const secondaryMeta = computed(() => ELEMENT_META[props.secondaryElement] || ELEMENT_META.fire);

const KEYWORD_COLORS = ['#D4553A', '#C9A962', '#4A8B6E', '#5B8FCE'];
</script>

<template>
  <article class="w-[350px] border border-smoke bg-charcoal p-5 space-y-5">
    <!-- Header -->
    <div class="space-y-1">
      <p class="text-[10px] uppercase tracking-[3px] text-gold/[0.38] font-sans">FIVE ELEMENTS CHART</p>
      <h2 class="font-title text-2xl font-medium text-paper">五行能量图谱</h2>
    </div>

    <!-- Radar -->
    <div class="bg-void p-3">
      <RadarChart :values="finalVector" :size="310" />
    </div>

    <!-- Primary / Secondary Elements -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: primaryMeta.color }" />
        <span class="text-[13px] text-paper font-sans">主属性：{{ primaryMeta.cn }} — {{ primaryMeta.trait }}{{ primaryMeta.cn === '火' ? '、行动力强' : primaryMeta.cn === '木' ? '、生命力旺' : primaryMeta.cn === '土' ? '、踏实稳重' : primaryMeta.cn === '金' ? '、逻辑清晰' : '、感知力强' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: secondaryMeta.color }" />
        <span class="text-[13px] text-paper font-sans">辅属性：{{ secondaryMeta.cn }} — {{ secondaryMeta.trait }}{{ secondaryMeta.cn === '土' ? '、重情重义' : secondaryMeta.cn === '火' ? '、热情奔放' : secondaryMeta.cn === '木' ? '、自我成长' : secondaryMeta.cn === '金' ? '、追求秩序' : '、善于共情' }}</span>
      </div>
    </div>

    <!-- Constellation Bonus -->
    <div v-if="constellationBonusText" class="flex items-center gap-2 bg-void px-3 py-2.5">
      <svg class="h-3.5 w-3.5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      <span class="text-xs text-gold font-sans">{{ constellationBonusText }}</span>
    </div>

    <!-- Keywords -->
    <div v-if="keywords.length" class="space-y-2">
      <p class="text-xs font-medium text-silver font-sans">性格关键词</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(word, idx) in keywords"
          :key="word"
          class="px-3 py-1.5 text-xs font-medium border"
          :style="{
            color: KEYWORD_COLORS[idx % KEYWORD_COLORS.length],
            backgroundColor: KEYWORD_COLORS[idx % KEYWORD_COLORS.length] + '18',
            borderColor: KEYWORD_COLORS[idx % KEYWORD_COLORS.length] + '30'
          }"
        >
          {{ word }}
        </span>
      </div>
    </div>

    <!-- Resonance -->
    <div v-if="resonanceText" class="space-y-2">
      <p class="text-xs font-medium text-silver font-sans">城市共鸣解析</p>
      <p class="text-[13px] leading-[1.7] text-pearl font-sans">{{ resonanceText }}</p>
    </div>
  </article>
</template>
