<script setup>
import { computed } from 'vue';

const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  profile: {
    type: Object,
    required: true
  },
  constellation: {
    type: Object,
    required: true
  },
  bazi: {
    type: Object,
    required: true
  },
  reportDate: {
    type: String,
    default: ''
  }
});

const displayName = computed(() => props.profile?.name?.trim() || '灵魂旅人');

const profileDate = computed(() => {
  const value = props.profile?.birthDate;
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return '未填写生日';
  }
  const [year, month, day] = value.split('-').map((part) => Number(part));
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
});

const issueDate = computed(() => props.reportDate || '--.--.--');
</script>

<template>
  <article
    class="relative aspect-[3/4] overflow-hidden rounded-[30px] border border-white/25 bg-[#101a34] text-paper shadow-card"
  >
    <div class="absolute inset-0" :style="{ background: city.background }" />
    <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/65" />
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,255,255,0.28),transparent_40%),radial-gradient(circle_at_82%_68%,rgba(255,255,255,0.16),transparent_35%)]"
    />

    <div class="relative flex h-full flex-col justify-between p-6 sm:p-8">
      <header class="space-y-3">
        <p class="font-body text-xs uppercase tracking-[0.34em] text-paper/80">City Soul Postcard</p>
        <div class="flex items-end justify-between gap-3">
          <h2 class="font-title text-[42px] leading-none text-paper sm:text-[50px]">{{ city.name }}</h2>
          <span class="rounded-full border border-white/35 bg-black/20 px-3 py-1 text-xs tracking-wide">
            {{ city.postcardTag }}
          </span>
        </div>
        <p class="max-w-[16rem] text-sm leading-relaxed text-paper/90 sm:max-w-[18rem]">{{ city.soulCopy }}</p>
      </header>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-2 text-xs text-paper/95">
          <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1.5">{{ displayName }}</span>
          <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1.5">{{ issueDate }}</span>
          <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1.5">{{ constellation.name }}</span>
          <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1.5">日柱 {{ bazi.dayPillar }}</span>
        </div>

        <div class="rounded-2xl border border-white/30 bg-black/24 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-paper/70">Traveler Record</p>
          <p class="mt-2 text-sm text-paper/90">出生日期 {{ profileDate }}</p>
          <p class="mt-1 text-sm text-paper/90">星象元素 {{ constellation.astro }}</p>
        </div>
      </div>

      <div
        class="absolute right-4 top-4 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border border-white/45 bg-black/20 text-center font-script text-xl leading-none text-paper/90"
      >
        灵签
      </div>
    </div>
  </article>
</template>
