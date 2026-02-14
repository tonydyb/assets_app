# ADR-005: UI 使用 MVP.css

- 状态: Accepted
- 日期: 2026-02-14
- 决策者: Tei
- 技术栈: Electron, Vanilla JS / React, SQLite, better-sqlite3

---

## 背景 (Context)

本项目是一个本地桌面资产管理系统，目标是：

- 快速开发
- 最小依赖
- 易维护
- 原生性能
- 本地运行，无网络依赖

UI 需求包括：

- Dashboard
- Asset Types 管理
- Assets 管理
- Charts 显示
- Modify / Create / Delete 操作

项目优先级：

1. 功能优先
2. 可维护性优先
3. 开发效率优先
4. UI 美观为次要

不希望引入复杂 UI 框架，例如：

- Material UI
- Ant Design
- Bootstrap

因为这些框架：

- 体积大
- 学习成本高
- 增加依赖复杂度
- 增加 Electron 打包体积

---

## 决策 (Decision)

选择使用 MVP.css 作为 UI 样式框架。

MVP.css 是一个：

- classless CSS framework
- 极简
- 无 JS
- 无依赖
- 自动美化 HTML 元素

官方网站：

https://andybrewer.github.io/mvp/

使用方式：

```html
<link rel="stylesheet" href="https://unpkg.com/mvp.css">
````

或本地：

```html
<link rel="stylesheet" href="./assets/mvp.css">
```

---

## 理由 (Rationale)

### 1. 零依赖

无需：

* npm install
* build
* bundler

适合 Electron 本地应用。

---

### 2. 自动美化 HTML

无需写 class：

```html
<button>Add Asset</button>

<table>
<tr><th>Name</th></tr>
<tr><td>Stock</td></tr>
</table>
```

自动变为现代 UI。

---

### 3. 与 Vanilla JS 完美兼容

无需 React：

```html
<form>
  <label>Name</label>
  <input>
  <button>Add</button>
</form>
```

立即拥有现代 UI。

---

### 4. 与 React 完全兼容

React JSX：

```jsx
<button onClick={addAsset}>
  Add Asset
</button>
```

无需 className。

---

### 5. 极小体积

约：

```
~7 KB
```

对比：

| Framework   | Size   |
| ----------- | ------ |
| Bootstrap   | 200KB+ |
| Material UI | MB级    |
| Ant Design  | MB级    |
| MVP.css     | ~7KB   |

---

### 6. 非常适合 Desktop Tool

目标用户：

* 自己
* 内部工具

无需复杂 UI。

---

### 7. 更少代码

无需：

```html
<div class="container">
<div class="row">
<div class="col-md-6">
```

只需：

```html
<main>
<section>
```

---

## 实现方式 (Implementation)

目录：

```
renderer/
│
├── dashboard.html
├── assets.html
├── asset-types.html
│
└── css/
    └── mvp.css
```

dashboard.html：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./css/mvp.css">
<title>Dashboard</title>
</head>

<body>

<header>
<h1>Asset Manager</h1>

<nav>
<a href="dashboard.html">Dashboard</a>
<a href="assets.html">Assets</a>
<a href="asset-types.html">Asset Types</a>
</nav>

</header>

<main>

<section>
<h2>Actions</h2>

<button>Add Asset</button>
<button>Add Asset Type</button>

</section>

<section>
<h2>Summary</h2>

<p>Total Assets: ¥0</p>

</section>

</main>

</body>
</html>
```

---

## 优势 (Pros)

* 极简
* 无依赖
* 小体积
* 开发快
* 易维护
* 完美适合 Electron
* 支持 Vanilla JS
* 支持 React
* 无构建要求

---

## 缺点 (Cons)

* 不适合复杂 UI
* 不适合大型产品
* 不适合复杂组件系统

但本项目不需要这些。

---

## 备选方案 (Alternatives Considered)

### Bootstrap

优点：

* 功能丰富

缺点：

* 重
* class 太多
* 不够简洁

Rejected.

---

### TailwindCSS

优点：

* 灵活

缺点：

* 需要 build
* 学习成本高

Rejected.

---

### Material UI

优点：

* 专业 UI

缺点：

* 重
* React 绑定
* 不适合轻量 Electron

Rejected.

---

### 自定义 CSS

优点：

* 最灵活

缺点：

* 开发慢
* 维护成本高

Rejected.

---

## 结果 (Consequences)

系统 UI 将：

* 简洁
* 清晰
* 可维护
* 快速开发

并保持：

* 最小依赖
* 高性能
* 小体积 Electron App

---

## 结论 (Conclusion)

MVP.css 是本项目的最佳选择，因为：

* 极简
* 快速开发
* 无依赖
* 完美适合 Electron 本地工具

因此决定使用 MVP.css 作为 UI 框架。

---
