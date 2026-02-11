<script setup>
import { computed } from 'vue';
import { ELEMENT_ORDER, ELEMENT_META } from '../utils/elements';

const props = defineProps({
  values: {
    type: Object,
    required: true
  },
  size: {
    type: Number,
    default: 320
  }
});

const center = computed(() => props.size / 2);
const radius = computed(() => props.size * 0.36);

function pointAt(index, factor = 1) {
  const angle = ((Math.PI * 2) / ELEMENT_ORDER.length) * index - Math.PI / 2;
  return {
    x: center.value + Math.cos(angle) * radius.value * factor,
    y: center.value + Math.sin(angle) * radius.value * factor
  };
}

const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

const polygonPoints = computed(() => {
  return ELEMENT_ORDER.map((key, index) => {
    const ratio = Math.max(0, Math.min(1, (props.values[key] || 0) / 100));
    const point = pointAt(index, ratio);
    return `${point.x},${point.y}`;
  }).join(' ');
});

const labelPoints = computed(() => {
  return ELEMENT_ORDER.map((key, index) => {
    const point = pointAt(index, 1.15);
    return {
      key,
      x: point.x,
      y: point.y,
      name: ELEMENT_META[key].cn,
      value: Number((props.values[key] || 0).toFixed(1))
    };
  });
});

const axisLines = computed(() =>
  ELEMENT_ORDER.map((key, index) => {
    const point = pointAt(index, 1);
    return {
      key,
      x1: center.value,
      y1: center.value,
      x2: point.x,
      y2: point.y
    };
  })
);

const gridPolygons = computed(() =>
  gridLevels.map((level) =>
    ELEMENT_ORDER.map((_, index) => {
      const p = pointAt(index, level);
      return `${p.x},${p.y}`;
    }).join(' ')
  )
);
</script>

<template>
  <div class="w-full">
    <svg :width="size" :height="size" viewBox="0 0 320 320" class="mx-auto block w-full max-w-[360px]">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#57B27D" stop-opacity="0.55" />
          <stop offset="50%" stop-color="#FF7345" stop-opacity="0.46" />
          <stop offset="100%" stop-color="#4F8CCF" stop-opacity="0.5" />
        </linearGradient>
      </defs>

      <g>
        <polygon
          v-for="(poly, idx) in gridPolygons"
          :key="`grid-${idx}`"
          :points="poly"
          fill="none"
          stroke="#d0d5df"
          :stroke-opacity="0.35 + idx * 0.1"
          stroke-width="1"
        />

        <line
          v-for="line in axisLines"
          :key="line.key"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#c1c9d8"
          stroke-opacity="0.4"
          stroke-width="1"
        />

        <polygon :points="polygonPoints" fill="url(#radarFill)" stroke="#3E4C68" stroke-width="2.5" />

        <circle
          v-for="(item, idx) in labelPoints"
          :key="`dot-${item.key}`"
          :cx="pointAt(idx, Math.max(0, Math.min(1, (values[item.key] || 0) / 100))).x"
          :cy="pointAt(idx, Math.max(0, Math.min(1, (values[item.key] || 0) / 100))).y"
          r="4.2"
          fill="#243451"
        />

        <g v-for="item in labelPoints" :key="`label-${item.key}`">
          <text
            :x="item.x"
            :y="item.y"
            text-anchor="middle"
            dominant-baseline="middle"
            class="fill-[#37425D] text-[13px] font-semibold"
          >
            {{ item.name }} {{ item.value }}%
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>
