<script setup>
const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  hiddenCity: {
    type: Object,
    default: null
  }
});
</script>

<template>
  <article class="card-paper relative aspect-[3/4] overflow-hidden rounded-[30px] border border-[#c9c0ad] p-6 shadow-card sm:p-7">
    <div class="absolute inset-x-0 top-0 h-20" :style="{ background: city.background, opacity: 0.42 }" />
    <div class="absolute right-5 top-5 rounded-full border border-white/65 bg-white/65 px-3 py-1 text-xs text-[#2a3550]">
      {{ city.tone }}
    </div>

    <div class="relative flex h-full flex-col">
      <header>
        <p class="text-xs uppercase tracking-[0.24em] text-[#5f6982]">City Deep Report</p>
        <h2 class="mt-2 font-title text-[30px] leading-tight text-[#1f2638]">{{ city.name }} 城市深度报告</h2>
      </header>

      <section class="mt-4 rounded-2xl border border-[#d2d8e2] bg-white/75 p-3.5">
        <p class="text-xs uppercase tracking-[0.2em] text-[#5e6780]">城市人格</p>
        <p class="mt-2 text-sm leading-relaxed text-[#2e3a54]">{{ city.personality }}</p>
      </section>

      <section class="mt-3 rounded-2xl border border-[#d2d8e2] bg-white/75 p-3.5">
        <p class="text-xs uppercase tracking-[0.2em] text-[#5e6780]">城市密码 × 3</p>
        <ul class="mt-2 space-y-1.5 text-sm text-[#2e3a54]">
          <li v-for="item in city.passwords" :key="item" class="rounded-xl bg-[#eef2f8] px-3 py-1.5">{{ item }}</li>
        </ul>
      </section>

      <section class="mt-3 grid gap-2 sm:grid-cols-2">
        <div class="rounded-2xl border border-[#d2d8e2] bg-white/75 p-3">
          <p class="text-xs uppercase tracking-[0.2em] text-[#5e6780]">能量加成</p>
          <p class="mt-2 text-sm text-[#2e3a54]">{{ city.boost }}</p>
        </div>
        <div class="rounded-2xl border border-[#d2d8e2] bg-white/75 p-3">
          <p class="text-xs uppercase tracking-[0.2em] text-[#5e6780]">城市寄语</p>
          <p class="mt-2 text-sm text-[#2e3a54]">{{ city.blessing }}</p>
        </div>
      </section>

      <section v-if="hiddenCity" class="mt-3 rounded-2xl border border-dashed border-[#be8a6f] bg-[#fff3ea] p-3">
        <p class="text-xs uppercase tracking-[0.2em] text-[#8a4a2f]">隐藏城市彩蛋</p>
        <p class="mt-1 text-sm text-[#6c3925]">
          你还有一座隐藏城市：{{ hiddenCity.city.name }}（分差 {{ hiddenCity.gap }}%）
        </p>
      </section>
    </div>
  </article>
</template>
