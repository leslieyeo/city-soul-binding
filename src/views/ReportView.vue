<script setup>
import { computed, ref } from 'vue';
import html2canvas from 'html2canvas';
import CityPostcardCard from '../components/CityPostcardCard.vue';
import FiveElementCard from '../components/FiveElementCard.vue';
import CityReportCard from '../components/CityReportCard.vue';
import CityTicketCard from '../components/CityTicketCard.vue';

const props = defineProps({
  report: { type: Object, required: true },
  profile: { type: Object, required: true }
});

const emit = defineEmits(['retest']);

const reportDate = computed(() => formatDate(props.report.createdAt));

const postcardCardRef = ref(null);
const fiveElementsCardRef = ref(null);
const cityReportCardRef = ref(null);
const ticketCardRef = ref(null);

const saveError = ref('');
const savingCard = ref('');

function formatDate(dateInput) {
  const target = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(target.getTime())) return '--.--.--';
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function sanitizeFileName(value) {
  return (value || 'card').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-');
}

async function saveCardImage(cardKey) {
  saveError.value = '';

  const map = {
    postcard: { node: postcardCardRef.value, label: '城市明信片' },
    elements: { node: fiveElementsCardRef.value, label: '五行图谱' },
    report: { node: cityReportCardRef.value, label: '城市报告' },
    ticket: { node: ticketCardRef.value, label: '城市车票' }
  };

  const target = map[cardKey];
  if (!target?.node) {
    saveError.value = '卡片尚未生成，请稍后重试';
    return;
  }

  try {
    savingCard.value = cardKey;
    const scale = Math.max(2, Math.min(4, window.devicePixelRatio || 2));
    const canvas = await html2canvas(target.node, {
      backgroundColor: null,
      scale,
      useCORS: true
    });

    const link = document.createElement('a');
    const traveler = sanitizeFileName(props.profile.name.trim() || '灵魂旅人');
    const date = sanitizeFileName(reportDate.value);
    link.download = `${traveler}-${target.label}-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error(error);
    saveError.value = '保存失败，请稍后重试';
  } finally {
    savingCard.value = '';
  }
}

function handleRetest() {
  const accepted = window.confirm('相同答案 = 相同结果哦，确认清空数据重新开始吗？');
  if (accepted) emit('retest');
}
</script>

<template>
  <div class="space-y-8 py-6">
    <!-- Card 1: City Postcard -->
    <div class="flex flex-col items-center gap-3">
      <div ref="postcardCardRef">
        <CityPostcardCard
          :city="report.mainCity"
          :user-name="profile.name"
          :date="reportDate"
          :constellation="report.constellation"
          :bazi="report.bazi"
          :primary-element="report.primaryElement"
          :final-vector="report.finalVector"
        />
      </div>
      <button
        class="flex h-11 w-[350px] items-center justify-center gap-2 border border-smoke text-[13px] font-medium text-pearl transition hover:border-pearl/40"
        :disabled="savingCard === 'postcard'"
        @click="saveCardImage('postcard')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        <span>{{ savingCard === 'postcard' ? '保存中...' : '保存明信片' }}</span>
      </button>
    </div>

    <!-- Card 2: Five Elements -->
    <div class="flex flex-col items-center gap-3">
      <div ref="fiveElementsCardRef">
        <FiveElementCard
          :report="report"
          :final-vector="report.finalVector"
          :primary-element="report.primaryElement"
          :secondary-element="report.secondaryElement"
          :constellation-bonus-text="report.constellationBonusText"
          :keywords="report.keywords"
          :resonance-text="report.resonanceText"
        />
      </div>
      <button
        class="flex h-11 w-[350px] items-center justify-center gap-2 border border-smoke text-[13px] font-medium text-pearl transition hover:border-pearl/40"
        :disabled="savingCard === 'elements'"
        @click="saveCardImage('elements')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        <span>{{ savingCard === 'elements' ? '保存中...' : '保存五行图谱' }}</span>
      </button>
    </div>

    <!-- Card 3: City Report -->
    <div class="flex flex-col items-center gap-3">
      <div ref="cityReportCardRef">
        <CityReportCard
          :city="report.mainCity"
          :hidden-city="report.hiddenCity"
          :primary-element="report.primaryElement"
          :user-name="profile.name"
        />
      </div>
      <button
        class="flex h-11 w-[350px] items-center justify-center gap-2 border border-smoke text-[13px] font-medium text-pearl transition hover:border-pearl/40"
        :disabled="savingCard === 'report'"
        @click="saveCardImage('report')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        <span>{{ savingCard === 'report' ? '保存中...' : '保存城市报告' }}</span>
      </button>
    </div>

    <!-- Card 4: Ticket -->
    <div class="flex flex-col items-center gap-3">
      <div ref="ticketCardRef">
        <CityTicketCard
          :city="report.mainCity"
          :user-name="profile.name"
          :date="reportDate"
          :primary-element="report.primaryElement"
        />
      </div>
      <button
        class="flex h-11 w-[350px] items-center justify-center gap-2 border border-smoke text-[13px] font-medium text-pearl transition hover:border-pearl/40"
        :disabled="savingCard === 'ticket'"
        @click="saveCardImage('ticket')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        <span>{{ savingCard === 'ticket' ? '保存中...' : '保存车票' }}</span>
      </button>
    </div>

    <p v-if="saveError" class="text-center text-sm text-ember">{{ saveError }}</p>

    <!-- Footer -->
    <div class="flex flex-col items-center gap-4 pt-2">
      <div class="flex w-full items-center gap-3">
        <div class="h-px flex-1 bg-ash"></div>
        <span class="text-xs text-gold/[0.38]">✦</span>
        <div class="h-px flex-1 bg-ash"></div>
      </div>
      <button
        class="flex items-center gap-2 border border-smoke px-6 py-2.5 text-[13px] text-silver transition hover:border-pearl/40"
        @click="handleRetest"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
        <span>想重新探索？</span>
      </button>
      <p class="text-[11px] text-fog">本测试仅供娱乐参考</p>
    </div>
  </div>
</template>
