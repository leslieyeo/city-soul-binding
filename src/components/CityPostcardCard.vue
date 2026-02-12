<script setup>
import { computed } from 'vue';
import { ELEMENT_META } from '../utils/elements';

const props = defineProps({
  city: { type: Object, required: true },
  userName: { type: String, default: '' },
  date: { type: String, default: '' },
  constellation: { type: Object, default: null },
  bazi: { type: Object, default: null },
  primaryElement: { type: String, default: '' },
  finalVector: { type: Object, default: null }
});

const displayName = computed(() => props.userName?.trim() || '灵魂旅人');

const primaryElementCn = computed(() => {
  if (!props.primaryElement) return '';
  return ELEMENT_META[props.primaryElement]?.cn || '';
});

const dayElementCn = computed(() => {
  if (!props.bazi?.dayStemElement) return '';
  return ELEMENT_META[props.bazi.dayStemElement]?.cn || '';
});
</script>

<template>
  <article class="w-[350px] overflow-hidden border border-smoke bg-charcoal">
    <!-- City Image Area -->
    <div
      class="relative h-[220px] flex flex-col justify-end p-5"
      :style="{ background: city.background }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div class="relative">
        <h2 class="font-title text-[48px] font-semibold leading-none text-paper">{{ city.name }}</h2>
        <p class="mt-1 text-sm text-white/80 font-sans">{{ city.soulCopy }}</p>
      </div>
    </div>

    <!-- Info Section -->
    <div class="space-y-4 p-5">
      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        <span v-if="constellation" class="border border-gold/[0.19] bg-gold/[0.09] px-2.5 py-1 text-[11px] font-medium text-gold">
          {{ constellation.name }}
        </span>
        <span v-if="bazi" class="border border-gold/[0.19] bg-gold/[0.09] px-2.5 py-1 text-[11px] font-medium text-gold">
          {{ bazi.dayStem }}{{ dayElementCn }}
        </span>
        <span v-if="primaryElement" class="border border-jade/[0.19] bg-jade/[0.09] px-2.5 py-1 text-[11px] font-medium text-jade">
          {{ primaryElementCn }}{{ finalVector && primaryElement ? Math.round(finalVector[primaryElement] || 0) + '%' : '' }}
        </span>
      </div>

      <!-- Meta -->
      <div class="flex items-center justify-between">
        <span class="text-[13px] font-medium text-paper font-sans">{{ displayName }}</span>
        <span class="text-[13px] text-silver font-mono">{{ date }}</span>
      </div>
    </div>
  </article>
</template>
