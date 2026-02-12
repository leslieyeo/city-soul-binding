<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const selYear = ref(currentYear - 25);
const selMonth = ref(1);
const selDay = ref(1);

const days = computed(() => {
  const d = new Date(selYear.value, selMonth.value, 0).getDate();
  return Array.from({ length: d }, (_, i) => i + 1);
});

watch([selYear, selMonth], () => {
  const maxDay = new Date(selYear.value, selMonth.value, 0).getDate();
  if (selDay.value > maxDay) selDay.value = maxDay;
});

const displayText = computed(() => {
  if (!props.modelValue) return '';
  const [y, m, d] = props.modelValue.split('-');
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`;
});

// --- Scroll wheel logic ---
const ITEM_H = 44;
const VISIBLE = 5;
const yearCol = ref(null);
const monthCol = ref(null);
const dayCol = ref(null);
let scrollTimers = {};

function padTop() {
  return Math.floor(VISIBLE / 2);
}

function scrollToIndex(el, index, smooth = false) {
  if (!el) return;
  el.scrollTop = index * ITEM_H;
}

function getColItems(col) {
  if (col === 'year') return years;
  if (col === 'month') return months;
  return days.value;
}

function setColValue(col, val) {
  if (col === 'year') selYear.value = val;
  else if (col === 'month') selMonth.value = val;
  else selDay.value = val;
}

function onScrollCol(col) {
  clearTimeout(scrollTimers[col]);
  scrollTimers[col] = setTimeout(() => {
    const el = col === 'year' ? yearCol.value : col === 'month' ? monthCol.value : dayCol.value;
    if (!el) return;
    const items = getColItems(col);
    const idx = Math.round(el.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    setColValue(col, items[clamped]);
    scrollToIndex(el, clamped, true);
  }, 80);
}

function openSheet() {
  if (props.modelValue) {
    const [y, m, d] = props.modelValue.split('-').map(Number);
    selYear.value = y;
    selMonth.value = m;
    selDay.value = d;
  }
  open.value = true;
  nextTick(() => {
    scrollToIndex(yearCol.value, years.indexOf(selYear.value));
    scrollToIndex(monthCol.value, selMonth.value - 1);
    scrollToIndex(dayCol.value, selDay.value - 1);
  });
}

function confirm() {
  const y = selYear.value;
  const m = String(selMonth.value).padStart(2, '0');
  const d = String(selDay.value).padStart(2, '0');
  emit('update:modelValue', `${y}-${m}-${d}`);
  open.value = false;
}

function tapItem(col, value) {
  if (col === 'year') {
    selYear.value = value;
    nextTick(() => scrollToIndex(yearCol.value, years.indexOf(value)));
  } else if (col === 'month') {
    selMonth.value = value;
    nextTick(() => scrollToIndex(monthCol.value, value - 1));
  } else {
    selDay.value = value;
    nextTick(() => scrollToIndex(dayCol.value, value - 1));
  }
}

onBeforeUnmount(() => {
  Object.values(scrollTimers).forEach(clearTimeout);
});
</script>

<template>
  <!-- Trigger -->
  <div
    class="flex h-12 items-center bg-charcoal px-3.5 cursor-pointer"
    @click="openSheet"
  >
    <span class="flex-1 text-sm font-sans" :class="modelValue ? 'text-paper' : 'text-fog'">
      {{ displayText || '选择出生日期' }}
    </span>
    <svg class="h-4 w-4 text-fog shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>

  <!-- Bottom Sheet -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-50 flex flex-col justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="open = false" />

        <!-- Panel -->
        <div class="sheet-panel relative bg-void rounded-t-2xl flex flex-col">
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="h-1 w-10 rounded-full bg-smoke" />
          </div>

          <!-- Title row -->
          <div class="flex items-center justify-between px-5 pb-3">
            <button class="text-sm text-pearl font-sans" @click="open = false">取消</button>
            <h3 class="text-base font-medium text-paper font-sans">选择出生日期</h3>
            <button class="text-sm font-medium text-gold font-sans" @click="confirm">确定</button>
          </div>

          <div class="h-px bg-smoke mx-5" />

          <!-- Column labels -->
          <div class="flex px-5 pt-3">
            <div class="flex-1 text-center text-xs text-silver font-sans">年</div>
            <div class="flex-1 text-center text-xs text-silver font-sans">月</div>
            <div class="flex-1 text-center text-xs text-silver font-sans">日</div>
          </div>

          <!-- Wheel columns -->
          <div class="relative flex px-5 py-1" :style="{ height: ITEM_H * VISIBLE + 'px' }">
            <!-- Highlight bar -->
            <div
              class="pointer-events-none absolute left-5 right-5 z-0 rounded-lg bg-charcoal border border-smoke/50"
              :style="{ top: ITEM_H * padTop() + 4 + 'px', height: ITEM_H + 'px' }"
            />

            <!-- Year column -->
            <div
              ref="yearCol"
              class="wheel-col relative z-10 flex-1 overflow-y-auto"
              @scroll="onScrollCol('year')"
            >
              <div :style="{ height: ITEM_H * padTop() + 'px' }" />
              <div
                v-for="y in years"
                :key="y"
                class="wheel-item flex items-center justify-center font-sans text-sm cursor-pointer"
                :class="y === selYear ? 'text-paper font-medium' : 'text-fog'"
                :style="{ height: ITEM_H + 'px' }"
                @click="tapItem('year', y)"
              >
                {{ y }}
              </div>
              <div :style="{ height: ITEM_H * padTop() + 'px' }" />
            </div>

            <!-- Month column -->
            <div
              ref="monthCol"
              class="wheel-col relative z-10 flex-1 overflow-y-auto"
              @scroll="onScrollCol('month')"
            >
              <div :style="{ height: ITEM_H * padTop() + 'px' }" />
              <div
                v-for="m in months"
                :key="m"
                class="wheel-item flex items-center justify-center font-sans text-sm cursor-pointer"
                :class="m === selMonth ? 'text-paper font-medium' : 'text-fog'"
                :style="{ height: ITEM_H + 'px' }"
                @click="tapItem('month', m)"
              >
                {{ m }} 月
              </div>
              <div :style="{ height: ITEM_H * padTop() + 'px' }" />
            </div>

            <!-- Day column -->
            <div
              ref="dayCol"
              class="wheel-col relative z-10 flex-1 overflow-y-auto"
              @scroll="onScrollCol('day')"
            >
              <div :style="{ height: ITEM_H * padTop() + 'px' }" />
              <div
                v-for="d in days"
                :key="d"
                class="wheel-item flex items-center justify-center font-sans text-sm cursor-pointer"
                :class="d === selDay ? 'text-paper font-medium' : 'text-fog'"
                :style="{ height: ITEM_H + 'px' }"
                @click="tapItem('day', d)"
              >
                {{ d }} 日
              </div>
              <div :style="{ height: ITEM_H * padTop() + 'px' }" />
            </div>
          </div>

          <!-- Safe area -->
          <div class="h-[env(safe-area-inset-bottom,8px)]" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wheel-col {
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.wheel-col::-webkit-scrollbar {
  display: none;
}
.wheel-item {
  scroll-snap-align: start;
}

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
