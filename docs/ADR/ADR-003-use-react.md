# ADR-003: 使用 React 作为 Renderer UI 框架

Status: Accepted (Implemented)  
Date: 2026-02-14  
Author: Tei

---

## Context（背景）

系统是本地运行的 Electron 个人资产管理应用，包含多页面动态 UI：

- Dashboard（汇总）
- Assets（列表与编辑）
- Asset Types（类型管理）
- Chart（图表）

在该复杂度下，Vanilla JS 会导致状态和视图同步成本较高，长期维护压力增大。

---

## Decision（决策）

Renderer 层采用 React。

当前落地方式：

- 在页面中加载 React 18 / ReactDOM 18
- 使用 `renderer/app-react.js` 作为 React 入口
- React 运行时以本地静态资源形式引入：`renderer/vendor/react.production.min.js`、`renderer/vendor/react-dom.production.min.js`
- 按页面文件名渲染对应组件（`DashboardPage`、`AssetsPage`、`AddAssetPage`、`AssetTypesPage`、`ChartPage`）

数据访问链路：

```text
React UI
  -> Electron IPC (window.api)
  -> Main Process (assetService)
  -> sql.js
  -> SQLite file (data/assets.db)
```

---

## Decision Drivers（决策驱动）

1. 页面复杂度已超过“纯 DOM 拼接”舒适区。  
2. 需要更清晰的组件边界与状态管理。  
3. 便于后续扩展筛选、分页、图表交互等能力。  
4. 与 Electron Renderer 兼容性良好。

---

## Considered Alternatives（备选方案）

### Vanilla JavaScript

优点：依赖少。  
缺点：状态与 UI 同步分散，随着功能增长维护成本高。  
结论：不采用。

### Vue / Angular

均可实现需求，但当前团队与代码路径选择 React，迁移成本与收益比不占优。  
结论：不采用。

---

## Consequences（后果）

正面：

- UI 结构更清晰，组件职责明确
- 同类页面交互模式更一致
- 后续重构与扩展更可控

代价：

- 引入 React 运行时依赖
- 需要维护组件化代码风格

---

## Implementation Notes（实施说明）

- `renderer/*.html` 保留页面壳与样式，并提供 `#root` 挂载点
- `renderer/app-react.js` 统一管理页面组件逻辑
- Main/IPC/数据库层不因本次 UI 框架切换而改变

---

## Summary（结论）

ADR-003 已落地：Renderer 层现采用 React，实现与决策一致。
