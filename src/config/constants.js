export const STORAGE_KEY = 'city-soul-binding-progress-v1';

export const STAGES = {
    AUTH: 'auth',
    PROFILE: 'profile',
    QUIZ: 'quiz',
    TRANSITION: 'transition',
    CALCULATING: 'calculating',
    REPORT: 'report'
};

export const STAGE_LABELS = {
    [STAGES.AUTH]: '授权验证',
    [STAGES.PROFILE]: '基础信息',
    [STAGES.QUIZ]: '答题中',
    [STAGES.TRANSITION]: '章节过渡',
    [STAGES.CALCULATING]: '计算中',
    [STAGES.REPORT]: '灵魂报告'
};
