<script setup>
import { computed } from 'vue';
import { ELEMENT_ORDER, ELEMENT_META } from '../utils/elements';

const props = defineProps({
  values: { type: Object, required: true },
  size: { type: Number, default: 320 }
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
    const point = pointAt(index, 1.2);
    return {
      key,
      x: point.x,
      y: point.y,
      name: ELEMENT_META[key].cn,
      color: ELEMENT_META[key].color,
      value: Number((props.values[key] || 0).toFixed(1))
    };
  });
});

const axisLines = computed(() =>
  ELEMENT_ORDER.map((key, index) => {
    const point = pointAt(index, 1);
    return { key, x1: center.value, y1: center.value, x2: point.x, y2: point.y };
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
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="mx-auto block w-full max-w-[310px]">
      <defs>
        <linearGradient id="radarFillDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4A8B6E" stop-opacity="0.4" />
          <stop offset="50%" stop-color="#C9A962" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#5B8FCE" stop-opacity="0.35" />
        </linearGradient>
      </defs>

      <g>
        <polygon
          v-for="(poly, idx) in gridPolygons"
          :key="`grid-${idx}`"
          :points="poly"
          fill="none"
          stroke="#2A2A2A"
          stroke-width="1"
        />

        <line
          v-for="line in axisLines"
          :key="line.key"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#2A2A2A"
          stroke-width="1"
        />

        <polygon
          :points="polygonPoints"
          fill="url(#radarFillDark)"
          stroke="#C9A962"
          stroke-opacity="0.3"
          stroke-width="1.5"
        />

        <circle
          v-for="(item, idx) in labelPoints"
          :key="`dot-${item.key}`"
          :cx="pointAt(idx, Math.max(0, Math.min(1, (values[item.key] || 0) / 100))).x"
          :cy="pointAt(idx, Math.max(0, Math.min(1, (values[item.key] || 0) / 100))).y"
          r="3"
          :fill="item.color"
        />

        <g v-for="item in labelPoints" :key="`label-${item.key}`">
          <text
            :x="item.x"
            :y="item.y"
            text-anchor="middle"
            dominant-baseline="middle"
            :fill="item.color"
            class="text-[11px] font-medium"
            font-family="Inter, sans-serif"
          >
            {{ item.name }} {{ item.value }}%
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>
