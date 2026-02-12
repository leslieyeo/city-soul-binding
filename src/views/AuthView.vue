<script setup>
import { ref } from 'vue';
import { normalizeCode, verifyAuthorizationCode } from '../utils/auth';

const props = defineProps(['initialCode']);
const emit = defineEmits(['auth-success']);

const authCodeInput = ref(props.initialCode || '');
const authError = ref('');
const isAuthorizing = ref(false);

function formatCodeInput(value) {
  const compact = normalizeCode(value).replace(/-/g, '').slice(0, 8);
  if (compact.length <= 4) return compact;
  return `${compact.slice(0, 4)}-${compact.slice(4)}`;
}

function handleCodeInput(event) {
  authCodeInput.value = formatCodeInput(event.target.value || '');
  authError.value = '';
}

async function submitAuthorization() {
  authError.value = '';
  const code = formatCodeInput(authCodeInput.value);
  authCodeInput.value = code;

  if (!code) {
    authError.value = '请输入授权码';
    return;
  }

  isAuthorizing.value = true;
  try {
    const result = await verifyAuthorizationCode(code);
    if (!result.valid) {
      authError.value =
        result.reason === 'format'
          ? '授权码格式不正确，示例：SL7K-M2XP'
          : '授权码无效或已损坏，请核对后重试';
      return;
    }
    emit('auth-success', { code: result.code, input: result.code });
  } catch (error) {
    authError.value = '校验失败，请稍后重试';
  } finally {
    isAuthorizing.value = false;
  }
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
          <span class="text-[11px] font-medium text-gold font-sans">授权验证</span>
        </div>
      </div>
      <div class="mt-4 h-px w-full bg-smoke"></div>
    </header>

    <!-- Auth Content -->
    <div class="space-y-6 px-5 py-8">
      <!-- Lock Icon -->
      <div class="flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center bg-charcoal">
          <svg class="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <div class="space-y-3 text-center">
        <h2 class="font-title text-2xl font-medium text-paper">输入授权码</h2>
        <p class="text-[13px] leading-[1.6] text-pearl font-sans">
          请输入 8 位授权码开始你的灵魂之旅<br />
          格式示例：SL7K-M2XP
        </p>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="submitAuthorization">
        <div class="flex h-[52px] items-center bg-charcoal px-4">
          <input
            :value="authCodeInput"
            type="text"
            maxlength="9"
            class="w-full bg-transparent text-center font-mono text-lg tracking-[4px] text-paper placeholder:text-fog outline-none"
            placeholder="XXXX-XXXX"
            @input="handleCodeInput"
          />
        </div>

        <p v-if="authError" class="text-center text-sm text-ember">{{ authError }}</p>

        <button
          type="submit"
          class="flex h-[52px] w-full items-center justify-center gap-2 bg-gold text-sm font-semibold text-void transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="isAuthorizing"
        >
          <svg v-if="isAuthorizing" class="h-[18px] w-[18px] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <svg v-else class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>{{ isAuthorizing ? '校验中...' : '开始验证' }}</span>
        </button>
      </form>
    </div>

    <!-- Footer -->
    <div class="space-y-4 px-5 py-6">
      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-ash"></div>
        <span class="text-xs text-gold/[0.38]">✦</span>
        <div class="h-px flex-1 bg-ash"></div>
      </div>
      <div class="space-y-2 text-center">
        <p class="text-[11px] text-fog font-sans">本测试仅供娱乐参考</p>
        <p class="text-[11px] text-silver font-sans">授权码可在小红书店铺购买 ¥1.99</p>
      </div>
    </div>
  </div>
</template>
