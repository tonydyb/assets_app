# 中文阅读版：003-ui-codebase-refactor

## 变更目标

对 renderer UI 代码做一次内部重构，让后续 UI 和功能迭代更稳。

本变更不是新功能，也不是重新设计产品；它的目标是：

1. 清理 CSS：只保留当前 Figma/Stitch 视觉体系，不再让旧 MVP 样式和新样式互相覆盖。
2. 拆分 `app-react.js`：把所有页面和工具函数从一个大文件拆成多个可维护模块。
3. 保持功能不变：用户已有数据、资产 CRUD、资产类型、汇率、图表、导入导出、Rebalance 都不能被破坏。

## 为什么要做

当前代码有两个明显问题：

### CSS 叠加

`renderer/mvp.css` 里同时存在：

- 旧 MVP 风格的 `--color-*` 变量和全局样式。
- 新设计风格的 `--am-*` 变量和覆盖样式。

`button`、`input`、`select`、`form`、`label` 这些基础元素被多处定义，导致类似 `Add Type` 按钮和输入框不对齐的问题反复出现。

### JS 文件过大

`renderer/app-react.js` 已经包含：

- 多语言字典。
- 格式化函数。
- 汇率换算。
- App Shell。
- Dashboard。
- Assets。
- Add Asset。
- Asset Types。
- Settings。
- Chart。
- Rebalance。

所有内容放在一个文件里，后续修改任何页面都容易误伤其他页面。

## 范围

包含：

- 建立单一 CSS token 体系。
- 删除 active CSS 中旧的 `--color-*` 依赖。
- 统一按钮、输入框、下拉框、表单的尺寸和对齐规则。
- 把 CSS 按 tokens / reset / base / layout / components / pages 组织。
- 把 `app-react.js` 拆成 i18n、utils、shared components、pages。
- 必要时引入轻量前端打包方式，例如 Vite 或 esbuild。
- 保持 `npm start` 能正常运行。

不包含：

- 新业务功能。
- 数据库 schema 变更。
- 云备份 / AWS S3。
- 登录、订阅、收费。
- 替换 Electron。

## 推荐目标结构

CSS：

```text
renderer/styles/
  index.css
  tokens.css
  reset.css
  base.css
  layout.css
  components.css
  pages.css
```

React：

```text
renderer/src/
  app.jsx
  i18n.js
  utils/
    format.js
    currency.js
  components/
    AppShell.jsx
    MainNav.jsx
    StatusFooter.jsx
    Card.jsx
    DataTable.jsx
    FormField.jsx
  pages/
    DashboardPage.jsx
    AssetsPage.jsx
    AddAssetPage.jsx
    AssetTypesPage.jsx
    SettingsPage.jsx
    ChartPage.jsx
    RebalancePage.jsx
```

## 验收重点

### CSS

- 只保留一个当前有效的设计 token 体系。
- `button/input/select` 不再因为历史样式叠加导致错位。
- Add Type 输入框和按钮自然对齐，不需要临时 patch。
- Add Asset 表单保持紧凑，不占满整页。
- Dashboard、Chart、Assets、Settings 等页面视觉不倒退。

### JS

- `app-react.js` 不再是所有页面的大杂烩。
- 每个页面组件有独立文件。
- i18n、格式化、汇率换算从页面代码中抽离。
- App shell / navigation / footer 可复用。

### 行为保持

重构后以下功能必须继续可用：

- Dashboard 总资产计算。
- Chart 柱状图。
- Assets CRUD。
- Add Asset。
- Asset Types CRUD 和 Region。
- Settings 语言、显示币种、汇率、导入导出。
- Rebalance。
- 多语言：英文、中文、日文。
- 本地数据库不丢数据。

## 实现建议

推荐分两阶段：

1. 先做 CSS 重构，因为它能直接解决当前 UI 对齐问题。
2. 再做 JS 模块拆分，因为这一步更大，需要逐页回归。

每个阶段都要单独运行应用验证，避免一次性大改后难以定位问题。
