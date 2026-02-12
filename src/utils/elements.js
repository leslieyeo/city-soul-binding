export const ELEMENT_ORDER = ['wood', 'fire', 'earth', 'metal', 'water'];

export const ELEMENT_META = {
  wood: {
    cn: '木',
    color: '#4A8B6E',
    trait: '生长'
  },
  fire: {
    cn: '火',
    color: '#D4553A',
    trait: '热力'
  },
  earth: {
    cn: '土',
    color: '#C9A962',
    trait: '承载'
  },
  metal: {
    cn: '金',
    color: '#848484',
    trait: '秩序'
  },
  water: {
    cn: '水',
    color: '#5B8FCE',
    trait: '流动'
  }
};

export function createEmptyVector(initialValue = 0) {
  return {
    wood: initialValue,
    fire: initialValue,
    earth: initialValue,
    metal: initialValue,
    water: initialValue
  };
}

export function sumVector(vector) {
  return ELEMENT_ORDER.reduce((sum, key) => sum + (vector[key] || 0), 0);
}

export function normalizeVector(vector) {
  const total = sumVector(vector);
  if (!total) {
    return createEmptyVector(20);
  }
  const normalized = createEmptyVector(0);
  ELEMENT_ORDER.forEach((key) => {
    normalized[key] = Number((((vector[key] || 0) / total) * 100).toFixed(2));
  });

  // 避免浮点误差导致总和不是 100
  const diff = Number((100 - sumVector(normalized)).toFixed(2));
  if (diff !== 0) {
    const maxKey = ELEMENT_ORDER.reduce((prev, cur) =>
      normalized[cur] > normalized[prev] ? cur : prev
    );
    normalized[maxKey] = Number((normalized[maxKey] + diff).toFixed(2));
  }

  return normalized;
}

export function weightedMerge(vectors) {
  const merged = createEmptyVector(0);

  vectors.forEach(({ vector, weight }) => {
    ELEMENT_ORDER.forEach((key) => {
      merged[key] += (vector[key] || 0) * weight;
    });
  });

  return normalizeVector(merged);
}

export function vectorToArray(vector) {
  return ELEMENT_ORDER.map((key) => vector[key] || 0);
}

export function getTopElements(vector, count = 2) {
  return [...ELEMENT_ORDER]
    .sort((a, b) => (vector[b] || 0) - (vector[a] || 0))
    .slice(0, count);
}
