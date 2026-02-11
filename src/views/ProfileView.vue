<script setup>
import { computed } from 'vue';
import { HOUR_OPTIONS } from '../utils/astrology';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  },
  preview: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:profile', 'submit']);

// Use a local computed proxy for v-model binding if needed, 
// or imply the parent state is reactive and passed down. 
// Since we are mutating props.profile directly (which is reactive object from parent), 
// Vue allows deep mutation of objects, but let's be careful. 
// For better pattern, we emit changes, but straightforward binding is fine for this refactor level.

const form = computed({
  get: () => props.profile,
  set: (val) => emit('update:profile', val)
});

const canStartQuiz = computed(() => {
  return form.value.name.trim().length > 0 && Boolean(parseBirthDate(form.value.birthDate));
});

function parseBirthDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  return new Date(Date.UTC(year, month - 1, day));
}

function handleSubmit() {
  if (canStartQuiz.value) {
    emit('submit');
  }
}
</script>

<template>
  <section class="card-paper rounded-3xl border border-white/10 p-5 shadow-card sm:p-8">
    <h2 class="font-title text-2xl text-ink">填写基础信息</h2>
    <p class="mt-2 text-sm text-[#4c5670]">用于生成专属报告展示。姓名和生日为必填项。</p>

    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      <label class="space-y-2 text-sm text-[#3a445b]">
        <span>姓名 *</span>
        <input v-model.trim="form.name" type="text" class="input-shell bg-[#152141] text-paper" placeholder="例如：林夏" />
      </label>

      <label class="space-y-2 text-sm text-[#3a445b]">
        <span>出生日期 *</span>
        <input v-model="form.birthDate" type="date" class="input-shell bg-[#152141] text-paper" />
      </label>

      <label class="space-y-2 text-sm text-[#3a445b]">
        <span>出生时辰（可选）</span>
        <select v-model="form.hourBranch" class="input-shell bg-[#152141] text-paper">
          <option v-for="item in HOUR_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </label>

      <label class="space-y-2 text-sm text-[#3a445b]">
        <span>性别（可选）</span>
        <select v-model="form.gender" class="input-shell bg-[#152141] text-paper">
          <option value="">不填写</option>
          <option value="female">女</option>
          <option value="male">男</option>
        </select>
      </label>
    </div>

    <div v-if="preview" class="mt-5 rounded-2xl border border-[#d5dae3] bg-white/70 p-4">
      <p class="text-sm text-[#2d374d]">
        你的星座是 <strong>{{ preview.constellation.name }}</strong>（{{ preview.constellation.astro }}），
        五行日柱为 <strong>{{ preview.bazi.dayPillar }}</strong>（{{ preview.dayElementCn }}）。
      </p>
    </div>

    <button class="btn-primary mt-5 w-full" :disabled="!canStartQuiz" @click="handleSubmit">进入 35 题测试</button>
  </section>
</template>
