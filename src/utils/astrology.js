import { createEmptyVector, normalizeVector } from './elements';

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STEM_ELEMENT = {
  甲: 'wood',
  乙: 'wood',
  丙: 'fire',
  丁: 'fire',
  戊: 'earth',
  己: 'earth',
  庚: 'metal',
  辛: 'metal',
  壬: 'water',
  癸: 'water'
};

const BRANCH_ELEMENT = {
  子: 'water',
  丑: 'earth',
  寅: 'wood',
  卯: 'wood',
  辰: 'earth',
  巳: 'fire',
  午: 'fire',
  未: 'earth',
  申: 'metal',
  酉: 'metal',
  戌: 'earth',
  亥: 'water'
};

const BASE_DAY_UTC = Date.UTC(1984, 1, 2); // 1984-02-02 甲子日

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

function getYearPillar(year, month, day) {
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    adjustedYear -= 1;
  }

  const stemIndex = mod(adjustedYear - 4, 10);
  const branchIndex = mod(adjustedYear - 4, 12);

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemIndex,
    branchIndex
  };
}

function getMonthPillar(year, month, day) {
  let adjustedMonth = month;
  let yearForMonthStem = year;

  if (month < 2 || (month === 2 && day < 4)) {
    yearForMonthStem -= 1;
  }

  if (day < 4) {
    adjustedMonth -= 1;
    if (adjustedMonth <= 0) {
      adjustedMonth = 12;
      yearForMonthStem -= 1;
    }
  }

  const branchIndex = mod(adjustedMonth, 12);
  const yearStemIndex = mod(yearForMonthStem - 4, 10);
  const stemIndex = mod(yearStemIndex * 2 + branchIndex, 10);

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemIndex,
    branchIndex
  };
}

function getDayPillar(year, month, day) {
  const targetUtc = Date.UTC(year, month - 1, day);
  const diffDays = Math.floor((targetUtc - BASE_DAY_UTC) / 86400000);
  const index = mod(diffDays, 60);
  const stemIndex = index % 10;
  const branchIndex = index % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    stemIndex,
    branchIndex,
    cycleIndex: index
  };
}

export const HOUR_OPTIONS = [
  { label: '不确定', value: 'unknown' },
  { label: '子时（23:00-00:59）', value: '子' },
  { label: '丑时（01:00-02:59）', value: '丑' },
  { label: '寅时（03:00-04:59）', value: '寅' },
  { label: '卯时（05:00-06:59）', value: '卯' },
  { label: '辰时（07:00-08:59）', value: '辰' },
  { label: '巳时（09:00-10:59）', value: '巳' },
  { label: '午时（11:00-12:59）', value: '午' },
  { label: '未时（13:00-14:59）', value: '未' },
  { label: '申时（15:00-16:59）', value: '申' },
  { label: '酉时（17:00-18:59）', value: '酉' },
  { label: '戌时（19:00-20:59）', value: '戌' },
  { label: '亥时（21:00-22:59）', value: '亥' }
];

function getHourPillar(dayStemIndex, hourBranch) {
  if (!hourBranch || hourBranch === 'unknown') {
    return null;
  }

  const branchIndex = EARTHLY_BRANCHES.indexOf(hourBranch);
  if (branchIndex < 0) {
    return null;
  }

  const stemBase = (dayStemIndex % 5) * 2;
  const stemIndex = mod(stemBase + branchIndex, 10);

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: hourBranch,
    stemIndex,
    branchIndex
  };
}

export function computeBaziProfile({ year, month, day, hourBranch }) {
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(year, month, day);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.stemIndex, hourBranch);

  const vector = createEmptyVector(0);

  const addPillar = (pillar, stemWeight, branchWeight) => {
    if (!pillar) {
      return;
    }
    vector[STEM_ELEMENT[pillar.stem]] += stemWeight;
    vector[BRANCH_ELEMENT[pillar.branch]] += branchWeight;
  };

  addPillar(yearPillar, 1.0, 1.0);
  addPillar(monthPillar, 1.2, 1.2);
  addPillar(dayPillar, 1.6, 1.4);
  addPillar(hourPillar, 0.9, 0.9);

  const normalized = normalizeVector(vector);

  return {
    vector: normalized,
    pillars: {
      year: `${yearPillar.stem}${yearPillar.branch}`,
      month: `${monthPillar.stem}${monthPillar.branch}`,
      day: `${dayPillar.stem}${dayPillar.branch}`,
      hour: hourPillar ? `${hourPillar.stem}${hourPillar.branch}` : '未知'
    },
    dayStem: dayPillar.stem,
    dayStemElement: STEM_ELEMENT[dayPillar.stem],
    dayPillar: `${dayPillar.stem}${dayPillar.branch}`
  };
}

const CONSTELLATIONS = [
  { name: '摩羯座', element: 'earth', start: [12, 22], end: [1, 19], astro: '土象' },
  { name: '水瓶座', element: 'air', start: [1, 20], end: [2, 18], astro: '风象' },
  { name: '双鱼座', element: 'water', start: [2, 19], end: [3, 20], astro: '水象' },
  { name: '白羊座', element: 'fire', start: [3, 21], end: [4, 19], astro: '火象' },
  { name: '金牛座', element: 'earth', start: [4, 20], end: [5, 20], astro: '土象' },
  { name: '双子座', element: 'air', start: [5, 21], end: [6, 21], astro: '风象' },
  { name: '巨蟹座', element: 'water', start: [6, 22], end: [7, 22], astro: '水象' },
  { name: '狮子座', element: 'fire', start: [7, 23], end: [8, 22], astro: '火象' },
  { name: '处女座', element: 'earth', start: [8, 23], end: [9, 22], astro: '土象' },
  { name: '天秤座', element: 'air', start: [9, 23], end: [10, 23], astro: '风象' },
  { name: '天蝎座', element: 'water', start: [10, 24], end: [11, 22], astro: '水象' },
  { name: '射手座', element: 'fire', start: [11, 23], end: [12, 21], astro: '火象' }
];

const CONSTELLATION_VECTOR = {
  fire: { wood: 15, fire: 70, earth: 10, metal: 0, water: 5 },
  earth: { wood: 5, fire: 10, earth: 70, metal: 15, water: 0 },
  air: { wood: 10, fire: 0, earth: 10, metal: 65, water: 15 },
  water: { wood: 15, fire: 0, earth: 5, metal: 10, water: 70 }
};

const CONSTELLATION_BONUS_ELEMENT = {
  fire: 'fire',
  earth: 'earth',
  air: 'metal',
  water: 'water'
};

function inRange(month, day, startMonth, startDay, endMonth, endDay) {
  if (startMonth < endMonth || (startMonth === endMonth && startDay <= endDay)) {
    return (
      (month > startMonth || (month === startMonth && day >= startDay)) &&
      (month < endMonth || (month === endMonth && day <= endDay))
    );
  }

  return (
    month > startMonth ||
    month < endMonth ||
    (month === startMonth && day >= startDay) ||
    (month === endMonth && day <= endDay)
  );
}

export function getConstellation(month, day) {
  const found = CONSTELLATIONS.find((item) => {
    const [startMonth, startDay] = item.start;
    const [endMonth, endDay] = item.end;
    return inRange(month, day, startMonth, startDay, endMonth, endDay);
  });

  return found || CONSTELLATIONS[0];
}

export function getConstellationVector(constellation) {
  return CONSTELLATION_VECTOR[constellation.element] || CONSTELLATION_VECTOR.earth;
}

export function getConstellationBonusText(constellation) {
  const key = CONSTELLATION_BONUS_ELEMENT[constellation.element] || 'earth';
  const map = {
    wood: '木属性 +12%',
    fire: '火属性 +12%',
    earth: '土属性 +12%',
    metal: '金属性 +12%',
    water: '水属性 +12%'
  };

  return `${constellation.name}${constellation.astro}加持，${map[key]}`;
}

export function getStemElement(stem) {
  return STEM_ELEMENT[stem];
}
