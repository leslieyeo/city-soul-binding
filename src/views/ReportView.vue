<script setup>
import { computed, ref, onMounted } from 'vue';
import html2canvas from 'html2canvas';

import CityPostcardCard from '../components/CityPostcardCard.vue';
import FiveElementCard from '../components/FiveElementCard.vue';
import CityReportCard from '../components/CityReportCard.vue';
import CityTicketCard from '../components/CityTicketCard.vue';
import { getConstellationVector } from '../utils/astrology';

const props = defineProps({
  report: {
    type: Object,
    required: true
  },
  profile: {
    type: Object,
    required: true
  }
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
  if (Number.isNaN(target.getTime())) {
    return '--.--.--';
  }
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
  if (accepted) {
    emit('retest');
  }
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <!-- Card 1: City Postcard -->
    <div class="relative mx-auto max-w-[360px]">
      <div ref="postcardCardRef">
        <CityPostcardCard
          :city="report.mainCity"
          :user-name="profile.name"
          :date="reportDate"
          :constellation="report.constellation"
          :bazi="report.bazi"
        />
      </div>
      <button
        class="btn-secondary mt-3 w-full"
        :disabled="savingCard === 'postcard'"
        @click="saveCardImage('postcard')"
      >
        {{ savingCard === 'postcard' ? '保存中...' : '保存明信片' }}
      </button>
    </div>

    <!-- Card 2: Five Elements Radar -->
    <div class="relative mx-auto max-w-[360px]">
      <div ref="fiveElementsCardRef">
        <FiveElementCard
          :report="report"
          :vector-list="report.vectorList"
          :resonance-text="report.resonanceText"
          :final-vector="report.finalVector"
          :constellation-vector="report.constellationVector"
        />
      </div>
      <button
        class="btn-secondary mt-3 w-full"
        :disabled="savingCard === 'elements'"
        @click="saveCardImage('elements')"
      >
        {{ savingCard === 'elements' ? '保存中...' : '保存五行图谱' }}
      </button>
    </div>

    <!-- Card 3: City Deep Report -->
    <div class="relative mx-auto max-w-[360px]">
      <div ref="cityReportCardRef">
        <CityReportCard
          :city="report.mainCity"
          :hidden-city="report.hiddenCity"
          :user-name="profile.name"
        />
      </div>
      <button
        class="btn-secondary mt-3 w-full"
        :disabled="savingCard === 'report'"
        @click="saveCardImage('report')"
      >
        {{ savingCard === 'report' ? '保存中...' : '保存城市报告' }}
      </button>
    </div>

    <!-- Card 4: Ticket -->
    <div class="relative mx-auto max-w-[360px]">
      <div ref="ticketCardRef">
        <CityTicketCard
          :city="report.mainCity"
          :user-name="profile.name"
          :date="reportDate"
          :element-cn="report.primaryElement ? report.primaryElement.cn : ''"
        />
      </div>
      <button
        class="btn-secondary mt-3 w-full"
        :disabled="savingCard === 'ticket'"
        @click="saveCardImage('ticket')"
      >
        {{ savingCard === 'ticket' ? '保存中...' : '保存车票' }}
      </button>
    </div>

    <div v-if="saveError" class="text-center text-sm text-[#d44f2f]">{{ saveError }}</div>

    <div class="pt-8 text-center">
      <button class="text-sm text-mist hover:text-paper" @click="handleRetest">
        想重新探索？
      </button>
    </div>
  </div>
</template>
