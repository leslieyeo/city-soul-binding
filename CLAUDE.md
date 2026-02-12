# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # 启动开发服务器 (Vite)
npm run build        # 生产构建 → dist/
npm run preview      # 预览生产构建
npm run generate:codes  # 生成 20,000 个授权码 → codes.csv
```

无测试框架、无 lint 配置。

## Architecture

纯前端 Vue 3 单页应用，无后端。通过五行/星座/性格测试匹配用户的灵魂城市。

### 阶段流转 (App.vue 统一管理)

```
AUTH → PROFILE → QUIZ → CALCULATING → REPORT
```

App.vue 是唯一的状态中心，用 `ref/reactive` 管理所有数据，通过 props/emits 与 4 个 view 通信。进度自动存入 localStorage (`city-soul-binding-progress-v1`)，刷新页面可恢复。

### 核心算法流 (utils/)

```
profile (birthDate + hourBranch)
  → astrology.js: computeBaziProfile → innateVector (五行权重, 25%)
  → astrology.js: getConstellation → constellationVector (星座→五行, 15%)

answers (35题)
  → calc.js: computeQuizVector → quizVector (答题→五行, 60%)

三向量加权合成 → finalVector
  → calc.js: cosineSimilarity vs 20城市 vector → 排序匹配
  → mainCity + hiddenCity (差距<5%时触发)
```

所有计算为纯函数，同输入同输出，无随机性。

### 数据资产

- `src/data/cities.js` — 20 座城市，每座含五行向量、文案、配色、明信片标签等
- `src/data/questions.js` — 4 篇章 35 题，每题 5 选项对应五行元素

### 授权码系统 (utils/auth.js)

纯前端 HMAC-SHA256 验证，格式 `XXXX-YYYY`，前 4 位 payload + 后 4 位签名。Secret 在 `.env` 或硬编码默认值。`generate-codes.js` 批量生成用于小红书发货。

### 报告卡片导出

ReportView 包含 4 张卡片组件（明信片/五行/报告/车票），使用 html2canvas 截图导出为图片。

## Style

- 深色主题，自定义色板定义在 `tailwind.config.cjs`（void/charcoal/gold/jade 等）
- 字体：title 用 Cormorant Garamond + Noto Serif SC，正文用 Inter + Noto Sans SC
- 移动端优先设计
- 部署：GitHub Pages (base: `/city-soul-binding/`) + Vercel
