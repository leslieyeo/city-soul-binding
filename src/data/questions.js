export const chapters = [
  {
    id: 1,
    key: 'soul-base',
    title: '第一篇章 · 灵魂底色',
    subtitle: '探索你内心最深处的倾向',
    transitionText: '灵魂底色已解析——你的五行雏形正在浮现...',
    questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  {
    id: 2,
    key: 'life-style',
    title: '第二篇章 · 生活方式',
    subtitle: '你的日常，藏着你的城市基因',
    transitionText: '生活图谱已绘制——城市轮廓开始清晰...',
    questionIds: [10, 11, 12, 13, 14, 15, 16, 17]
  },
  {
    id: 3,
    key: 'energy-frequency',
    title: '第三篇章 · 能量频率',
    subtitle: '你的气场与哪片土地共振',
    transitionText: '能量频率已锁定——五行共鸣达到峰值...',
    questionIds: [18, 19, 20, 21, 22, 23, 24, 25, 26]
  },
  {
    id: 4,
    key: 'city-instinct',
    title: '第四篇章 · 城市直觉',
    subtitle: '让直觉引导你走向那座城',
    transitionText: '',
    questionIds: [27, 28, 29, 30, 31, 32, 33, 34, 35]
  }
];

export const questions = [
  {
    id: 1,
    chapter: 1,
    title: '如果你的人生是一本书，它更像？',
    options: [
      { label: 'A', text: '武侠小说——快意恩仇', element: 'fire' },
      { label: 'B', text: '散文集——平淡有味', element: 'earth' },
      { label: 'C', text: '科幻小说——探索未知', element: 'metal' },
      { label: 'D', text: '诗集——浪漫细腻', element: 'water' },
      { label: 'E', text: '冒险故事——自由生长', element: 'wood' }
    ]
  },
  {
    id: 2,
    chapter: 1,
    title: '你更害怕失去什么？',
    options: [
      { label: 'A', text: '自由与可能性', element: 'wood' },
      { label: 'B', text: '热情与冲劲', element: 'fire' },
      { label: 'C', text: '稳定的安全感', element: 'earth' },
      { label: 'D', text: '秩序与规则', element: 'metal' },
      { label: 'E', text: '感情联结', element: 'water' }
    ]
  },
  {
    id: 3,
    chapter: 1,
    title: '在一段关系中，你最在意？',
    options: [
      { label: 'A', text: '彼此成长空间', element: 'wood' },
      { label: 'B', text: '热烈的表达与回应', element: 'fire' },
      { label: 'C', text: '长久可靠的陪伴', element: 'earth' },
      { label: 'D', text: '边界清晰、互相尊重', element: 'metal' },
      { label: 'E', text: '情绪被理解与接住', element: 'water' }
    ]
  },
  {
    id: 4,
    chapter: 1,
    title: '面对冲突，你的第一反应？',
    options: [
      { label: 'A', text: '先说开，别憋着', element: 'fire' },
      { label: 'B', text: '先冷静分析逻辑', element: 'metal' },
      { label: 'C', text: '先退一步观察气氛', element: 'water' },
      { label: 'D', text: '先安抚再解决问题', element: 'earth' },
      { label: 'E', text: '先找突破点，快速翻篇', element: 'wood' }
    ]
  },
  {
    id: 5,
    chapter: 1,
    title: '你的能量什么时候最旺？',
    options: [
      { label: 'A', text: '清晨，开始新计划时', element: 'wood' },
      { label: 'B', text: '中午，节奏最热烈时', element: 'fire' },
      { label: 'C', text: '傍晚，生活回到秩序时', element: 'metal' },
      { label: 'D', text: '深夜，情绪和灵感涌动时', element: 'water' },
      { label: 'E', text: '固定日常稳定推进时', element: 'earth' }
    ]
  },
  {
    id: 6,
    chapter: 1,
    title: '你最想拥有的超能力？',
    options: [
      { label: 'A', text: '治愈万物，让一切复苏', element: 'wood' },
      { label: 'B', text: '瞬间点燃全场士气', element: 'fire' },
      { label: 'C', text: '构筑绝对防护屏障', element: 'earth' },
      { label: 'D', text: '看穿真相与漏洞', element: 'metal' },
      { label: 'E', text: '读取他人情绪与记忆', element: 'water' }
    ]
  },
  {
    id: 7,
    chapter: 1,
    title: '你理想的退休生活？',
    options: [
      { label: 'A', text: '田园院子，种花种树', element: 'wood' },
      { label: 'B', text: '开一家热闹小店', element: 'fire' },
      { label: 'C', text: '守着家人，平稳安定', element: 'earth' },
      { label: 'D', text: '环游世界，收集城市建筑', element: 'metal' },
      { label: 'E', text: '住在海边，写诗听雨', element: 'water' }
    ]
  },
  {
    id: 8,
    chapter: 1,
    title: '你最不能接受的性格缺陷？',
    options: [
      { label: 'A', text: '迟钝保守，不愿改变', element: 'wood' },
      { label: 'B', text: '冷淡无趣，没有火花', element: 'fire' },
      { label: 'C', text: '情绪化，反复无常', element: 'earth' },
      { label: 'D', text: '混乱拖沓，没有原则', element: 'metal' },
      { label: 'E', text: '不共情，缺乏温度', element: 'water' }
    ]
  },
  {
    id: 9,
    chapter: 1,
    title: '如果要用一个词形容你的内核？',
    options: [
      { label: 'A', text: '生长', element: 'wood' },
      { label: 'B', text: '燃烧', element: 'fire' },
      { label: 'C', text: '承载', element: 'earth' },
      { label: 'D', text: '锋芒', element: 'metal' },
      { label: 'E', text: '流动', element: 'water' }
    ]
  },
  {
    id: 10,
    chapter: 2,
    title: '周五晚上下班，你最想？',
    options: [
      { label: 'A', text: '约朋友撸串喝酒', element: 'fire' },
      { label: 'B', text: '回家泡澡追剧', element: 'water' },
      { label: 'C', text: '去公园跑步散步', element: 'wood' },
      { label: 'D', text: '逛商场买点东西', element: 'metal' },
      { label: 'E', text: '叫外卖窝在沙发', element: 'earth' }
    ]
  },
  {
    id: 11,
    chapter: 2,
    title: '你理想的住所？',
    options: [
      { label: 'A', text: '有院子和绿植的房子', element: 'wood' },
      { label: 'B', text: '能看城市夜景的高层', element: 'fire' },
      { label: 'C', text: '社区成熟、生活便利', element: 'earth' },
      { label: 'D', text: '极简设计、线条利落', element: 'metal' },
      { label: 'E', text: '靠近河湖海，安静松弛', element: 'water' }
    ]
  },
  {
    id: 12,
    chapter: 2,
    title: '早餐你更愿意？',
    options: [
      { label: 'A', text: '新鲜果蔬和全麦', element: 'wood' },
      { label: 'B', text: '热辣重口，提神醒脑', element: 'fire' },
      { label: 'C', text: '粥粉面点，暖胃踏实', element: 'earth' },
      { label: 'D', text: '精确营养搭配套餐', element: 'metal' },
      { label: 'E', text: '清淡汤面或牛奶麦片', element: 'water' }
    ]
  },
  {
    id: 13,
    chapter: 2,
    title: '出门旅行你偏好？',
    options: [
      { label: 'A', text: '森林徒步，边走边探索', element: 'wood' },
      { label: 'B', text: '节庆活动，热闹现场', element: 'fire' },
      { label: 'C', text: '古镇慢逛，稳定行程', element: 'earth' },
      { label: 'D', text: '博物馆与现代建筑巡礼', element: 'metal' },
      { label: 'E', text: '海边发呆，听潮看云', element: 'water' }
    ]
  },
  {
    id: 14,
    chapter: 2,
    title: '你和一座城市最先产生联系的是？',
    options: [
      { label: 'A', text: '它的绿意与季节变化', element: 'wood' },
      { label: 'B', text: '它的人群活力与情绪', element: 'fire' },
      { label: 'C', text: '它的烟火气与生活感', element: 'earth' },
      { label: 'D', text: '它的建筑秩序与效率', element: 'metal' },
      { label: 'E', text: '它的河流海岸与湿度', element: 'water' }
    ]
  },
  {
    id: 15,
    chapter: 2,
    title: '你喜欢什么样的天气？',
    options: [
      { label: 'A', text: '春风和煦，万物生长', element: 'wood' },
      { label: 'B', text: '晴朗炽热，阳光张扬', element: 'fire' },
      { label: 'C', text: '温暖干燥，四平八稳', element: 'earth' },
      { label: 'D', text: '清冷通透，空气干净', element: 'metal' },
      { label: 'E', text: '细雨绵绵，云层低垂', element: 'water' }
    ]
  },
  {
    id: 16,
    chapter: 2,
    title: '你的衣柜风格？',
    options: [
      { label: 'A', text: '自然棉麻，松弛感强', element: 'wood' },
      { label: 'B', text: '高饱和亮色，存在感强', element: 'fire' },
      { label: 'C', text: '基础实穿，舒适第一', element: 'earth' },
      { label: 'D', text: '剪裁利落，黑白灰主导', element: 'metal' },
      { label: 'E', text: '柔软垂坠，低饱和冷色', element: 'water' }
    ]
  },
  {
    id: 17,
    chapter: 2,
    title: '你在一个城市最先找的地方？',
    options: [
      { label: 'A', text: '植物园或城市公园', element: 'wood' },
      { label: 'B', text: '夜市酒吧与演出现场', element: 'fire' },
      { label: 'C', text: '菜市场和社区食堂', element: 'earth' },
      { label: 'D', text: '地标商圈与美术馆', element: 'metal' },
      { label: 'E', text: '河岸步道或海边码头', element: 'water' }
    ]
  },
  {
    id: 18,
    chapter: 3,
    title: '以下哪种自然元素最吸引你？',
    options: [
      { label: 'A', text: '火焰', element: 'fire' },
      { label: 'B', text: '森林', element: 'wood' },
      { label: 'C', text: '岩石', element: 'earth' },
      { label: 'D', text: '金属光泽', element: 'metal' },
      { label: 'E', text: '水流', element: 'water' }
    ]
  },
  {
    id: 19,
    chapter: 3,
    title: '你更容易被什么音乐打动？',
    options: [
      { label: 'A', text: '民谣与自然采样', element: 'wood' },
      { label: 'B', text: '摇滚与强节奏鼓点', element: 'fire' },
      { label: 'C', text: '温暖人声与慢板', element: 'earth' },
      { label: 'D', text: '电子与极简实验声', element: 'metal' },
      { label: 'E', text: '钢琴与氛围流动感', element: 'water' }
    ]
  },
  {
    id: 20,
    chapter: 3,
    title: '一个直觉问题：东南西北，你选？',
    options: [
      { label: 'A', text: '东', element: 'wood' },
      { label: 'B', text: '南', element: 'fire' },
      { label: 'C', text: '中', element: 'earth' },
      { label: 'D', text: '西', element: 'metal' },
      { label: 'E', text: '北', element: 'water' }
    ]
  },
  {
    id: 21,
    chapter: 3,
    title: '你梦里最常出现的场景？',
    options: [
      { label: 'A', text: '树林、草坡、远路', element: 'wood' },
      { label: 'B', text: '灯火、宴会、舞台', element: 'fire' },
      { label: 'C', text: '家屋、厨房、土路', element: 'earth' },
      { label: 'D', text: '高塔、桥梁、机械结构', element: 'metal' },
      { label: 'E', text: '江河、雨夜、海岸线', element: 'water' }
    ]
  },
  {
    id: 22,
    chapter: 3,
    title: '哪种颜色让你最安心？',
    options: [
      { label: 'A', text: '苔绿', element: 'wood' },
      { label: 'B', text: '琥珀橙', element: 'fire' },
      { label: 'C', text: '麦穗黄', element: 'earth' },
      { label: 'D', text: '银灰', element: 'metal' },
      { label: 'E', text: '深海蓝', element: 'water' }
    ]
  },
  {
    id: 23,
    chapter: 3,
    title: '你的幸运数字直觉？',
    options: [
      { label: 'A', text: '3 或 8', element: 'wood' },
      { label: 'B', text: '2 或 7', element: 'fire' },
      { label: 'C', text: '5 或 10', element: 'earth' },
      { label: 'D', text: '4 或 9', element: 'metal' },
      { label: 'E', text: '1 或 6', element: 'water' }
    ]
  },
  {
    id: 24,
    chapter: 3,
    title: '如果你是一种天气现象？',
    options: [
      { label: 'A', text: '春日微风', element: 'wood' },
      { label: 'B', text: '盛夏雷暴', element: 'fire' },
      { label: 'C', text: '秋日晴空', element: 'earth' },
      { label: 'D', text: '寒潮霜降', element: 'metal' },
      { label: 'E', text: '夜雨连绵', element: 'water' }
    ]
  },
  {
    id: 25,
    chapter: 3,
    title: '你的情绪更像哪种水？',
    options: [
      { label: 'A', text: '露珠：轻盈敏锐', element: 'wood' },
      { label: 'B', text: '瀑布：爆发直接', element: 'fire' },
      { label: 'C', text: '溪流：温和持续', element: 'earth' },
      { label: 'D', text: '雨：克制有边界', element: 'metal' },
      { label: 'E', text: '深海：深沉包容', element: 'water' }
    ]
  },
  {
    id: 26,
    chapter: 3,
    title: '你觉得前世你可能是？',
    options: [
      { label: 'A', text: '远行的游侠', element: 'wood' },
      { label: 'B', text: '点火的祭司', element: 'fire' },
      { label: 'C', text: '守城的工匠', element: 'earth' },
      { label: 'D', text: '记录星图的学者', element: 'metal' },
      { label: 'E', text: '渡河的引路人', element: 'water' }
    ]
  },
  {
    id: 27,
    chapter: 4,
    title: '以下场景，哪个最让你心动？',
    options: [
      { label: 'A', text: '雾气缭绕的山城早晨', element: 'earth' },
      { label: 'B', text: '梧桐落叶的林荫大道', element: 'wood' },
      { label: 'C', text: '海风吹过的老城巷子', element: 'water' },
      { label: 'D', text: '霓虹闪烁的深夜街头', element: 'fire' },
      { label: 'E', text: '雪山脚下的寂静湖面', element: 'metal' }
    ]
  },
  {
    id: 28,
    chapter: 4,
    title: '你想和谁一起生活在一座城市？',
    options: [
      { label: 'A', text: '一起创业冒险的伙伴', element: 'wood' },
      { label: 'B', text: '情绪同频、表达热烈的人', element: 'fire' },
      { label: 'C', text: '把日子过稳的家人', element: 'earth' },
      { label: 'D', text: '互相尊重边界的知己', element: 'metal' },
      { label: 'E', text: '懂你沉默和柔软的人', element: 'water' }
    ]
  },
  {
    id: 29,
    chapter: 4,
    title: '哪种街头气味最吸引你？',
    options: [
      { label: 'A', text: '桂花与青草气息', element: 'wood' },
      { label: 'B', text: '烤串炭火香', element: 'fire' },
      { label: 'C', text: '火锅底料的浓香', element: 'earth' },
      { label: 'D', text: '手冲咖啡与烘焙香', element: 'metal' },
      { label: 'E', text: '海鲜与潮湿海风', element: 'water' }
    ]
  },
  {
    id: 30,
    chapter: 4,
    title: '你更想住在？',
    options: [
      { label: 'A', text: '郊区田园', element: 'wood' },
      { label: 'B', text: '老城中心', element: 'earth' },
      { label: 'C', text: '江边', element: 'water' },
      { label: 'D', text: '山腰', element: 'fire' },
      { label: 'E', text: '海边', element: 'metal' }
    ]
  },
  {
    id: 31,
    chapter: 4,
    title: '选一张明信片？',
    options: [
      { label: 'A', text: '雨后青石板与绿植小巷', element: 'wood' },
      { label: 'B', text: '夜色霓虹和人群笑声', element: 'fire' },
      { label: 'C', text: '古城墙与落日余晖', element: 'earth' },
      { label: 'D', text: '玻璃幕墙与轨道交通', element: 'metal' },
      { label: 'E', text: '码头灯塔与海平线', element: 'water' }
    ]
  },
  {
    id: 32,
    chapter: 4,
    title: '你觉得一座好城市最重要的是？',
    options: [
      { label: 'A', text: '机会与成长速度', element: 'wood' },
      { label: 'B', text: '活力与表达空间', element: 'fire' },
      { label: 'C', text: '包容与生活成本平衡', element: 'earth' },
      { label: 'D', text: '效率与规则感', element: 'metal' },
      { label: 'E', text: '氛围与情绪疗愈力', element: 'water' }
    ]
  },
  {
    id: 33,
    chapter: 4,
    title: '你想在哪里度过一个完美的下午？',
    options: [
      { label: 'A', text: '植物园温室', element: 'wood' },
      { label: 'B', text: '露天音乐节草坪', element: 'fire' },
      { label: 'C', text: '老街茶馆', element: 'earth' },
      { label: 'D', text: '现代艺术馆', element: 'metal' },
      { label: 'E', text: '江边长椅看云', element: 'water' }
    ]
  },
  {
    id: 34,
    chapter: 4,
    title: '你最向往的城市夜晚？',
    options: [
      { label: 'A', text: '夜跑穿过林荫大道', element: 'wood' },
      { label: 'B', text: '灯火通明的深夜食堂', element: 'fire' },
      { label: 'C', text: '巷子里缓慢散步聊天', element: 'earth' },
      { label: 'D', text: '高空酒吧俯瞰天际线', element: 'metal' },
      { label: 'E', text: '河畔吹风听远处船鸣', element: 'water' }
    ]
  },
  {
    id: 35,
    chapter: 4,
    title: '最后一题：闭上眼，脑海里浮现的第一个画面？',
    options: [
      { label: 'A', text: '发芽的枝条穿过晨光', element: 'wood' },
      { label: 'B', text: '篝火旁的人群与歌声', element: 'fire' },
      { label: 'C', text: '屋檐下冒着热气的饭菜', element: 'earth' },
      { label: 'D', text: '银色轨道延伸到远方', element: 'metal' },
      { label: 'E', text: '月光落在平静的水面', element: 'water' }
    ]
  }
];

export function getQuestionById(id) {
  return questions.find((item) => item.id === id);
}

export function getChapterById(chapterId) {
  return chapters.find((chapter) => chapter.id === chapterId);
}
