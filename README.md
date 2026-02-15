[中文](README.md) | [English](README.en.md) | [日本語](README.ja.md)

![sample1](docs/img/sample1.png)
![sample2](docs/img/sample2.png)

# Assets App

一个本地运行的个人资产管理桌面应用，基于 Electron + SQLite（`sql.js`）+ React 构建。

## 功能

- 资产记录管理（新增、编辑、删除、复制）
- 资产类型管理（新增、编辑、删除，带引用保护）
- Dashboard 展示最新日期资产与总额
- 按日期聚合的资产柱状图（Canvas）
- CNY -> JPY 汇率换算展示（可配置）

## 技术栈

- Electron 26
- SQLite（通过 `sql.js`）
- React 18（本地静态运行时文件）
- Vanilla CSS（MVP.css）

## 项目结构

```text
assets_app/
├─ main.js                     # Electron 主入口与 IPC 注册
├─ preload.js                  # 安全桥接 API（window.api）
├─ main/
│  ├─ assetService.js          # 业务逻辑
│  ├─ database.js              # sql.js 封装与持久化
│  └─ config.js                # 配置（如汇率）
├─ renderer/
│  ├─ dashboard.html
│  ├─ assets.html
│  ├─ add_asset.html
│  ├─ asset_types.html
│  ├─ chart.html
│  ├─ app-react.js             # React 页面逻辑
│  ├─ vendor/                  # React 运行时静态文件
│  └─ mvp.css
├─ data/
│  └─ assets.db                # SQLite 数据文件
└─ docs/
   ├─ 01.SRS.md
   ├─ 02.HLD.md
   ├─ 03.DDL.md
   ├─ 04.LLD.md
   ├─ 05.UI 设计文档.md
   └─ ADR/
```

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动应用

```bash
npm start
```

## 数据说明

- 数据库存储位置：`data/assets.db`
- 表：`asset_types`、`assets`
- 应用写操作后会持久化数据库文件

## 文档

- 需求：`/assets_app/docs/01.SRS.md`
- 架构：`/assets_app/docs/02.HLD.md`
- 数据库：`/assets_app/docs/03.DDL.md`
- 低级设计：`/assets_app/docs/04.LLD.md`
- UI 设计：`/assets_app/docs/05.UI 设计文档.md`
- ADR：`/assets_app/docs/ADR`

## Roadmap

- 统一错误码与错误处理规范
- 数据导出（CSV）
- 备份/恢复能力
- 数据筛选与分页

## License

MIT
