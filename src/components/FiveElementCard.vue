<script setup>
import { computed } from 'vue';
import RadarChart from './RadarChart.vue';
import { ELEMENT_META, ELEMENT_ORDER } from '../utils/elements';

const props = defineProps({
  vector: {
    type: Object,
    required: true
  },
  primaryElement: {
    type: String,
    required: true
  },
  secondaryElement: {
    type: String,
    required: true
  },
  constellationBonusText: {
    type: String,
    default: ''
  },
  keywords: {
    type: Array,
    default: () => []
  },
  resonanceText: {
    type: String,
    default: ''
  }
});

const bars = computed(() =>
  ELEMENT_ORDER.map((key) => ({
    key,
    name: ELEMENT_META[key].cn,
    color: ELEMENT_META[key].color,
    value: Number((props.vector[key] || 0).toFixed(2))
  }))
);

const primaryLabel = computed(() => ELEMENT_META[props.primaryElement]?.cn || '木');
const secondaryLabel = computed(() => ELEMENT_META[props.secondaryElement]?.cn || '火');
</script>

<template>
  <article class="card-paper relative aspect-[3/4] overflow-hidden rounded-[30px] border border-[#c9c0ad] p-5 shadow-card sm:p-6">
    <div class="absolute right-4 top-4 h-24 w-24 rounded-full bg-gradient-to-br from-jade/20 via-amber/15 to-tide/20 blur-2xl" />

    <div class="relative flex h-full flex-col">
      <header>
        <p class="text-xs uppercase tracking-[0.24em] text-[#6f7c95]">Five Elements Atlas</p>
        <h2 class="mt-2 font-title text-[28px] leading-tight text-[#1e2436]">五行能量图谱</h2>
        <p class="mt-2 text-sm text-[#404d68]">主属性 {{ primaryLabel }} · 辅属性 {{ secondaryLabel }}</p>
      </header>

      <div class="mt-4 rounded-2xl border border-[#d5d9e2] bg-white/70 p-3">
        <RadarChart :values="vector" :size="260" />
      </div>

      <div class="mt-3 grid grid-cols-5 gap-1.5">
        <div v-for="item in bars" :key="item.key" class="rounded-xl border border-[#d4d9e2] bg-white/75 p-2 text-center">
          <p class="text-[11px] text-[#58627a]">{{ item.name }}</p>
          <p class="mt-1 text-xs font-semibold text-[#2b354b]">{{ item.value }}%</p>
          <span class="mt-1 block h-1 rounded-full" :style="{ backgroundColor: item.color }" />
        </div>
      </div>

      <div class="mt-3 rounded-2xl border border-[#d6dbe4] bg-white/70 p-3">
        <p class="text-xs text-[#4d5b74]">{{ constellationBonusText }}</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="word in keywords"
            :key="word"
            class="rounded-full border border-[#c8d0de] bg-white px-2.5 py-1 text-xs text-[#293552]"
          >
            {{ word }}
          </span>
        </div>
      </div>

      <p class="mt-3 line-clamp-4 text-sm leading-relaxed text-[#36415d]">
        {{ resonanceText }}
      </p>
    </div>
  </article>
</template>
