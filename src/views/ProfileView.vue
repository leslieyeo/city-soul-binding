<script setup>
import { computed } from 'vue';
import { HOUR_OPTIONS } from '../utils/astrology';

const props = defineProps({
  profile: { type: Object, required: true },
  preview: { type: Object, default: null }
});

const emit = defineEmits(['update:profile', 'submit']);

const form = computed({
  get: () => props.profile,
  set: (val) => emit('update:profile', val)
});

const canStartQuiz = computed(() => {
  return form.value.name.trim().length > 0 && form.value.birthDate !== '';
});

function handleSubmit() {
  if (canStartQuiz.value) emit('submit');
}
</script>

<template>
  <div>
    <!-- Header -->
    <header class="px-5 pt-6 pb-0">
      <div class="flex items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[3px] text-gold/50 font-sans">CITY SOUL BINDING</p>
          <h1 class="font-title text-[28px] font-semibold text-paper">城市灵魂绑定</h1>
          <p class="text-[13px] text-pearl font-sans">五行 × 星座 × 个性测试报告</p>
        </div>
        <div class="shrink-0 bg-gold/[0.13] px-3 py-1.5">
          <span class="text-[11px] font-medium text-gold font-sans">基础信息</span>
        </div>
      </div>
      <div class="mt-4 h-px w-full bg-smoke"></div>
    </header>

    <!-- Profile Form -->
    <div class="space-y-5 px-5 py-6">
      <div>
        <h2 class="font-title text-[22px] font-medium text-paper">填写基础信息</h2>
        <p class="mt-1 text-[13px] text-silver font-sans">用于生成专属报告展示，姓名和生日为必填项</p>
      </div>

      <!-- Fields -->
      <div class="space-y-4">
        <!-- Name -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-pearl font-sans">姓名 *</label>
          <div class="flex h-12 items-center bg-charcoal px-3.5">
            <input
              v-model.trim="form.name"
              type="text"
              class="w-full bg-transparent text-sm text-paper placeholder:text-fog outline-none font-sans"
              placeholder="例如：林夏"
            />
          </div>
        </div>

        <!-- Birth Date -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-pearl font-sans">出生日期 *</label>
          <div class="relative flex h-12 items-center bg-charcoal px-3.5">
            <input
              v-model="form.birthDate"
              type="date"
              max="2026-12-31"
              class="w-full bg-transparent text-sm text-paper outline-none font-sans [color-scheme:dark]"
            />
          </div>
        </div>

        <!-- Optional divider -->
        <div class="flex items-center gap-3 pt-1">
          <div class="h-px flex-1 bg-ash"></div>
          <span class="text-[11px] text-fog font-sans">可选信息</span>
          <div class="h-px flex-1 bg-ash"></div>
        </div>

        <!-- Hour + Gender row -->
        <div class="flex gap-3">
          <div class="flex-1 space-y-1.5">
            <label class="text-xs font-medium text-pearl font-sans">出生时辰（可选）</label>
            <div class="flex h-12 items-center bg-charcoal px-3.5">
              <select
                v-model="form.hourBranch"
                class="w-full bg-transparent text-sm text-paper outline-none font-sans [color-scheme:dark]"
              >
                <option v-for="item in HOUR_OPTIONS" :key="item.value" :value="item.value" class="bg-charcoal text-paper">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="text-xs font-medium text-pearl font-sans">性别（可选）</label>
            <div class="flex h-12 items-center bg-charcoal px-3.5">
              <select
                v-model="form.gender"
                class="w-full bg-transparent text-sm text-paper outline-none font-sans [color-scheme:dark]"
              >
                <option value="" class="bg-charcoal text-paper">不填写</option>
                <option value="female" class="bg-charcoal text-paper">女</option>
                <option value="male" class="bg-charcoal text-paper">男</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="preview" class="bg-charcoal p-4 space-y-2">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span class="text-xs font-medium text-gold font-sans">命理速览</span>
        </div>
        <p class="text-[13px] leading-[1.6] text-paper font-sans">
          你的星座是 {{ preview.constellation.name }}（{{ preview.constellation.astro }}），五行日柱为 {{ preview.bazi.dayPillar }}（{{ preview.dayElementCn }}）
        </p>
      </div>

      <!-- Submit Button -->
      <button
        class="flex h-[52px] w-full items-center justify-center gap-2 bg-gold text-sm font-semibold text-void transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!canStartQuiz"
        @click="handleSubmit"
      >
        <svg class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.59L6 12l1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
        </svg>
        <span>进入 35 题测试</span>
      </button>
    </div>
  </div>
</template>
