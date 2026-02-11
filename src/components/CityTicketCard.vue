<script setup>
import { computed } from 'vue';
import { ELEMENT_META } from '../utils/elements';

const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  profile: {
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
  reportDate: {
    type: String,
    default: ''
  }
});

const displayName = computed(() => props.profile?.name?.trim() || '灵魂旅人');
const primaryLabel = computed(() => ELEMENT_META[props.primaryElement]?.cn || '木');
const secondaryLabel = computed(() => ELEMENT_META[props.secondaryElement]?.cn || '火');
const genderLabel = computed(() => {
  if (props.profile?.gender === 'male') {
    return '男';
  }
  if (props.profile?.gender === 'female') {
    return '女';
  }
  return '未填写';
});
</script>

<template>
  <article class="relative aspect-[3/4] overflow-hidden rounded-[30px] border border-[#d7bb8f] bg-[#f6ead1] p-5 text-[#3d2b18] shadow-card sm:p-6">
    <div class="absolute inset-0 opacity-18" :style="{ background: city.background }" />
    <div class="absolute inset-y-0 left-1/3 w-px border-r border-dashed border-[#9c7e53]" />
    <div class="absolute inset-y-0 right-4 flex flex-col justify-between py-6">
      <span class="h-3 w-3 rounded-full border border-[#8a6c44] bg-[#f6ead1]" />
      <span class="h-3 w-3 rounded-full border border-[#8a6c44] bg-[#f6ead1]" />
      <span class="h-3 w-3 rounded-full border border-[#8a6c44] bg-[#f6ead1]" />
      <span class="h-3 w-3 rounded-full border border-[#8a6c44] bg-[#f6ead1]" />
      <span class="h-3 w-3 rounded-full border border-[#8a6c44] bg-[#f6ead1]" />
      <span class="h-3 w-3 rounded-full border border-[#8a6c44] bg-[#f6ead1]" />
    </div>

    <div class="relative grid h-full grid-cols-[1fr_auto] gap-5">
      <div class="flex h-full flex-col">
        <p class="text-xs uppercase tracking-[0.28em] text-[#8c6f47]">Soul Rail Ticket</p>
        <h2 class="mt-2 font-title text-[26px] leading-tight">城市灵魂车票</h2>
        <p class="mt-1 text-sm text-[#75583a]">目的地：{{ city.name }}</p>

        <div class="mt-4 space-y-2 rounded-2xl border border-[#d2b587] bg-[#fff7e8] p-3">
          <div class="flex justify-between text-sm">
            <span class="text-[#856847]">乘客</span>
            <span class="font-semibold">{{ displayName }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-[#856847]">性别</span>
            <span class="font-semibold">{{ genderLabel }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-[#856847]">签发日期</span>
            <span class="font-semibold">{{ reportDate || '--.--.--' }}</span>
          </div>
        </div>

        <div class="mt-3 rounded-2xl border border-[#d2b587] bg-[#fff7e8] p-3 text-sm">
          <p class="font-semibold">属性组合</p>
          <p class="mt-1">主属性 {{ primaryLabel }} · 辅属性 {{ secondaryLabel }}</p>
          <p class="mt-2 text-xs text-[#7b5d3b]">永久有效 · 凭直觉检票</p>
        </div>

        <div class="mt-auto rounded-xl border border-dashed border-[#a5875e] bg-[#ffefd1] px-3 py-2 text-xs text-[#704d2d]">
          乘车提示：在 {{ city.name }} 你的情绪将被重新校准，越生活越同频。
        </div>
      </div>

      <div class="w-[84px] rounded-2xl border border-[#d2b587] bg-[#fff7e8] px-3 py-4 text-center">
        <p class="text-[10px] uppercase tracking-[0.18em] text-[#8f7450]">Stub</p>
        <p class="mt-3 font-title text-[18px] leading-tight">{{ city.name }}</p>
        <p class="mt-2 text-[10px] text-[#8f7450]">SOUL-01</p>
        <p class="mt-5 text-[10px] text-[#8f7450]">永久有效</p>
        <p class="mt-2 font-script text-lg leading-none">启程</p>
      </div>
    </div>
  </article>
</template>
