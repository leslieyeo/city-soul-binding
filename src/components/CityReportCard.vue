<script setup>
import { computed } from 'vue';
import { ELEMENT_META } from '../utils/elements';

const props = defineProps({
  city: { type: Object, required: true },
  hiddenCity: { type: Object, default: null },
  primaryElement: { type: String, default: '' },
  userName: { type: String, default: '' }
});

const primaryMeta = computed(() => ELEMENT_META[props.primaryElement] || ELEMENT_META.wood);
</script>

<template>
  <article class="w-[350px] border border-smoke bg-charcoal p-5 space-y-5">
    <!-- Header -->
    <div class="space-y-1">
      <p class="text-[10px] uppercase tracking-[3px] text-gold/[0.38] font-sans">CITY DEEP REPORT</p>
      <h2 class="font-title text-2xl font-medium text-paper">城市深度报告</h2>
    </div>

    <!-- Personality -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-silver font-sans">城市人格</p>
      <p class="text-sm leading-[1.7] text-paper font-sans">{{ city.personality }}</p>
    </div>

    <!-- City Codes -->
    <div class="space-y-3">
      <p class="text-xs font-medium text-silver font-sans">城市密码 × 3</p>
      <div
        v-for="(code, idx) in city.passwords"
        :key="idx"
        class="flex items-center gap-3"
      >
        <span class="font-mono text-xl font-medium text-gold/25">{{ String(idx + 1).padStart(2, '0') }}</span>
        <span class="text-sm text-paper font-sans">{{ code }}</span>
      </div>
    </div>

    <div class="h-px w-full bg-smoke"></div>

    <!-- Energy Boost -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-silver font-sans">你在这座城市的能量加成</p>
      <p class="text-[13px] leading-[1.6] text-paper font-sans">{{ city.boost }}</p>
    </div>

    <!-- Quote / Blessing -->
    <div class="bg-void p-4 space-y-3">
      <span class="font-title text-[28px] leading-none text-gold/25">「</span>
      <p class="text-sm leading-[1.6] text-gold font-sans">{{ city.blessing }}</p>
    </div>
  </article>
</template>
