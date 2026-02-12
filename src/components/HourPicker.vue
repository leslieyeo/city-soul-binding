<script setup>
import { ref, computed } from 'vue';
import { HOUR_OPTIONS } from '../utils/astrology';

const props = defineProps({
  modelValue: { type: String, default: 'unknown' }
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);

const currentLabel = computed(() => {
  const item = HOUR_OPTIONS.find(o => o.value === props.modelValue);
  return item ? item.label : '不确定';
});

function select(value) {
  emit('update:modelValue', value);
  open.value = false;
}
</script>

<template>
  <!-- Trigger -->
  <div
    class="flex h-12 items-center bg-charcoal px-3.5 cursor-pointer"
    @click="open = true"
  >
    <span class="flex-1 text-sm font-sans" :class="modelValue === 'unknown' ? 'text-fog' : 'text-paper'">
      {{ currentLabel }}
    </span>
    <svg class="h-4 w-4 text-fog shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  <!-- Bottom Sheet -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-50 flex flex-col justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="open = false" />

        <!-- Panel -->
        <div class="sheet-panel relative bg-void rounded-t-2xl max-h-[70vh] flex flex-col">
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="h-1 w-10 rounded-full bg-smoke" />
          </div>

          <!-- Title -->
          <div class="flex items-center justify-between px-5 pb-3">
            <h3 class="text-base font-medium text-paper font-sans">选择出生时辰</h3>
            <button class="text-xs text-pearl font-sans" @click="open = false">关闭</button>
          </div>

          <div class="h-px bg-smoke mx-5" />

          <!-- Options -->
          <div class="overflow-y-auto overscroll-contain px-5 py-3 space-y-1">
            <button
              v-for="item in HOUR_OPTIONS"
              :key="item.value"
              class="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left transition-colors"
              :class="modelValue === item.value ? 'bg-gold/15' : 'active:bg-smoke'"
              @click="select(item.value)"
            >
              <!-- Time branch character -->
              <span
                v-if="item.value !== 'unknown'"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-title font-semibold"
                :class="modelValue === item.value ? 'bg-gold text-void' : 'bg-charcoal text-pearl'"
              >
                {{ item.value }}
              </span>
              <span
                v-else
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
                :class="modelValue === item.value ? 'bg-gold text-void' : 'bg-charcoal text-pearl'"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
                </svg>
              </span>

              <!-- Label -->
              <div class="flex-1 min-w-0">
                <span
                  class="text-sm font-sans"
                  :class="modelValue === item.value ? 'text-gold font-medium' : 'text-paper'"
                >
                  {{ item.value === 'unknown' ? '不确定' : item.value + '时' }}
                </span>
                <span
                  v-if="item.value !== 'unknown'"
                  class="ml-2 text-xs font-sans"
                  :class="modelValue === item.value ? 'text-gold/60' : 'text-silver'"
                >
                  {{ item.label.match(/（(.+)）/)?.[1] }}
                </span>
              </div>

              <!-- Check -->
              <svg
                v-if="modelValue === item.value"
                class="h-5 w-5 shrink-0 text-gold"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          <!-- Safe area for iOS home indicator -->
          <div class="h-[env(safe-area-inset-bottom,8px)]" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>
