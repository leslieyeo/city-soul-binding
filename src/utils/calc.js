import { cities } from '../data/cities';
import { questions } from '../data/questions';
import {
  createEmptyVector,
  ELEMENT_ORDER,
  ELEMENT_META,
  getTopElements,
  normalizeVector,
  sumVector,
  vectorToArray,
  weightedMerge
} from './elements';

export const QUIZ_POINT_PER_QUESTION = 3;

export function computeQuizVector(answerMap) {
  const score = createEmptyVector(0);

  questions.forEach((question) => {
    const selectedIndex = answerMap[question.id];
    if (selectedIndex === undefined || selectedIndex === null) {
      return;
    }
    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) {
      return;
    }
    score[selectedOption.element] += QUIZ_POINT_PER_QUESTION;
  });

  return {
    raw: score,
    normalized: normalizeVector(score),
    totalScore: sumVector(score)
  };
}

function cosineSimilarity(vecA, vecB) {
  const arrA = vectorToArray(vecA);
  const arrB = vectorToArray(vecB);

  const dot = arrA.reduce((sum, value, index) => sum + value * arrB[index], 0);
  const normA = Math.sqrt(arrA.reduce((sum, value) => sum + value ** 2, 0));
  const normB = Math.sqrt(arrB.reduce((sum, value) => sum + value ** 2, 0));

  if (!normA || !normB) {
    return 0;
  }

  return dot / (normA * normB);
}

export function computeFinalVector({ innateVector, constellationVector, quizVector }) {
  return weightedMerge([
    { vector: innateVector, weight: 0.25 },
    { vector: constellationVector, weight: 0.15 },
    { vector: quizVector, weight: 0.6 }
  ]);
}

export function matchCities(finalVector) {
  return cities
    .map((city) => {
      const similarity = cosineSimilarity(finalVector, city.vector);
      return {
        ...city,
        similarity,
        similarityPercent: Number((similarity * 100).toFixed(2))
      };
    })
    .sort((a, b) => b.similarity - a.similarity);
}

export function getHiddenCity(matches) {
  if (!matches || matches.length < 2) {
    return null;
  }

  const [first, second] = matches;
  const gap = first.similarityPercent - second.similarityPercent;
  if (gap < 5) {
    return {
      city: second,
      gap: Number(gap.toFixed(2))
    };
  }

  return null;
}

export function getPersonalityKeywords(finalVector) {
  const top = getTopElements(finalVector, 4);
  const keywordMap = {
    wood: ['成长欲', '探索感', '生命力'],
    fire: ['感染力', '行动派', '热表达'],
    earth: ['稳定感', '责任心', '落地力'],
    metal: ['边界感', '秩序脑', '审美控'],
    water: ['共情力', '感知力', '韧性']
  };

  return top.map((key, index) => keywordMap[key][index % 3] || ELEMENT_META[key].trait);
}

export function buildResonanceText({ userName, finalVector, city }) {
  const [primary, secondary] = getTopElements(finalVector, 2);
  const primaryCn = ELEMENT_META[primary].cn;
  const secondaryCn = ELEMENT_META[secondary].cn;

  return `${userName}的能量以${primaryCn}为主、${secondaryCn}为辅，和${city.name}的城市向量形成高密度共振。你在这座城市会更容易把情绪转化为行动，把灵感转化为可执行计划。城市节奏既能承接你的敏感，也能推动你持续输出，属于“越生活越有状态”的匹配关系。`;
}

export function formatVectorList(vector) {
  return ELEMENT_ORDER.map((key) => ({
    key,
    name: ELEMENT_META[key].cn,
    value: Number((vector[key] || 0).toFixed(2)),
    color: ELEMENT_META[key].color
  }));
}
