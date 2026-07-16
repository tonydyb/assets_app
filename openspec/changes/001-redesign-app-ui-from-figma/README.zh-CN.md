# 中文阅读版：001-redesign-app-ui-from-figma

## 变更目标

根据 Figma 设计稿重做 Asset Manager 的界面，让应用从原来的基础 MVP 风格升级为更像正式金融工具的 Dashboard 风格。

本变更只做 UI 重设计，不改变核心业务模型。

## 设计来源

Figma：

https://www.figma.com/design/CNfvzjkUAth8azTLKpIedW/Asset-Manager?node-id=0-1&p=f&t=dMv1412dlGC2Erux-0

## 范围

包含：

- Dashboard
- Assets
- Add Asset
- Chart
- Asset Types
- Settings
- 顶部导航
- 卡片布局
- 表格样式
- 表单样式
- 按钮样式
- 页脚 FX 状态栏
- Chart 柱状图视觉
- Settings 中本地导入/导出入口

不包含：

- 数据库结构调整
- 新业务流程
- 云备份
- 登录/订阅/收费功能
- AI 诊断

## 必须保留的功能

UI 变漂亮以后，以下功能不能坏：

- 资产 CRUD
- 资产类型 CRUD
- 多语言切换
- 显示币种切换
- 手工维护汇率
- FX 状态提示
- Dashboard 总资产计算
- Chart 按日期展示资产趋势
- 本地 `.db` 导出
- 本地 `.db` 导入、确认、备份、重启

## 验收重点

### Dashboard

- 总资产突出显示。
- 总资产旁边显示当前显示币种。
- 当前资产使用新表格/卡片样式。
- FX 状态和更新时间仍然可见。

### Chart

- 显示按日期汇总的柱状图。
- 每个日期一根柱子。
- 柱子显示日期标签和金额标签。
- 图表显示当前显示币种。

### Assets / Add Asset

- 表格、分页、操作按钮符合 Figma 风格。
- 新增/编辑/删除/复制资产仍可用。
- 金额显示带 comma。
- 金额输入为整数。

### Asset Types

- 资产类型列表符合新 UI。
- 新增、编辑、删除仍可用。
- 多语言显示不破坏。

### Settings

- 设置页视觉符合 Figma。
- 语言、显示币种、汇率、导入导出入口都保留。
- 导入导出成功/失败反馈可见。

## 实现顺序

1. 读取 Figma 设计结构和 token。
2. 实现全局 app shell、导航、卡片、表格、表单、按钮样式。
3. 精修 Dashboard。
4. 精修 Chart。
5. 精修 Assets / Add Asset。
6. 精修 Asset Types。
7. 精修 Settings。
8. 做交互回归验证。
9. 根据实际截图做视觉微调。

## 风险

- Figma 中的数据是静态样例，实际实现必须使用真实数据库数据。
- UI 改动可能误伤已有功能，所以需要逐页验证。
- 多语言文案长度不同，布局需要避免溢出。
- Chart 需要真实数据驱动，不能只画静态图。

## 当前状态

该 change 已经用于指导 UI 重设计。剩余工作主要是完整 CRUD、导入导出、响应式、多语言长度等进一步回归验证。
