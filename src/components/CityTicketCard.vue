<script setup>
import { computed } from 'vue';
import { ELEMENT_META } from '../utils/elements';

const props = defineProps({
  city: { type: Object, required: true },
  userName: { type: String, default: '' },
  date: { type: String, default: '' },
  primaryElement: { type: String, default: '' }
});

const displayName = computed(() => props.userName?.trim() || '灵魂旅人');
const primaryMeta = computed(() => ELEMENT_META[props.primaryElement] || ELEMENT_META.wood);

const ticketNo = computed(() => {
  const d = props.date?.replace(/\./g, '') || '';
  return d ? `No. ${d}` : 'No. --------';
});
</script>

<template>
  <article class="w-[350px] border border-gold/[0.19] bg-[#1A1410]">
    <!-- Top -->
    <div class="flex items-center justify-between px-5 py-5">
      <div class="space-y-0.5">
        <p class="text-[9px] uppercase tracking-[3px] text-gold/[0.38] font-sans">CITY SOUL EXPRESS</p>
        <p class="font-title text-sm font-medium text-gold">城市灵魂特快</p>
      </div>
      <div class="text-right space-y-0.5">
        <p class="font-mono text-[10px] text-silver">{{ ticketNo }}</p>
        <p class="text-[9px] font-medium uppercase tracking-[2px] text-gold/[0.38] font-sans">FIRST CLASS</p>
      </div>
    </div>

    <!-- Dash line -->
    <div class="h-px w-full border-t border-dashed border-gold/[0.19]"></div>

    <!-- Body -->
    <div class="space-y-4 px-5 py-4">
      <!-- Route -->
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-[9px] uppercase tracking-[2px] text-silver font-sans">FROM</p>
          <p class="font-title text-[28px] font-semibold text-paper">此刻</p>
        </div>
        <svg class="h-6 w-6 text-gold/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div class="text-right space-y-1">
          <p class="text-[9px] uppercase tracking-[2px] text-silver font-sans">TO</p>
          <p class="font-title text-[28px] font-semibold text-gold">{{ city.name }}</p>
        </div>
      </div>

      <!-- Details -->
      <div class="flex items-start justify-between">
        <div class="space-y-0.5">
          <p class="text-[9px] uppercase tracking-[2px] text-silver font-sans">PASSENGER</p>
          <p class="text-sm font-medium text-paper font-sans">{{ displayName }}</p>
        </div>
        <div class="text-center space-y-0.5">
          <p class="text-[9px] uppercase tracking-[2px] text-silver font-sans">ELEMENT</p>
          <p class="text-sm font-medium font-sans" :style="{ color: primaryMeta.color }">{{ primaryMeta.cn }}</p>
        </div>
        <div class="text-right space-y-0.5">
          <p class="text-[9px] uppercase tracking-[2px] text-silver font-sans">DATE</p>
          <p class="font-mono text-sm text-paper">{{ date }}</p>
        </div>
      </div>

      <!-- Valid forever -->
      <div class="text-center pt-2">
        <p class="text-[11px] font-medium text-gold/[0.38] font-sans">✦  永久有效  ✦</p>
      </div>
    </div>
  </article>
</template>
