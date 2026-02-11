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
  if (compact.length <= 4) {
    return compact;
  }
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
  <section class="card-paper rounded-3xl border border-white/10 p-5 shadow-card sm:p-8">
    <h2 class="font-title text-2xl text-ink">输入授权码</h2>
    <p class="mt-2 text-sm text-[#475169]">请输入 8 位授权码，示例：SL7K-M2XP</p>

    <form class="mt-5 space-y-4" @submit.prevent="submitAuthorization">
      <input
        :value="authCodeInput"
        type="text"
        maxlength="9"
        class="input-shell bg-[#14203e] text-paper placeholder:text-mist/60"
        placeholder="XXXX-XXXX"
        @input="handleCodeInput"
      />

      <p v-if="authError" class="text-sm text-[#d44f2f]">{{ authError }}</p>

      <button type="submit" class="btn-primary w-full" :disabled="isAuthorizing">
        {{ isAuthorizing ? '校验中...' : '开始验证' }}
      </button>
    </form>
  </section>
</template>
