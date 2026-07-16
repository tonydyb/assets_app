[中文](README.md) | [English](README.en.md) | [日本語](README.ja.md)

![sample1](docs/img/sample1.png)
![sample2](docs/img/sample2.png)

# Asset Manager

一个本地运行的个人资产管理桌面应用，基于 Electron + SQLite（`sql.js`）+ React 构建。应用面向周期性资产快照管理：记录不同日期的资产组合，按显示币种换算总资产，并用 Dashboard 和图表观察资产变化。

## 功能

- Dashboard 展示最新日期资产快照和总资产。
- 总资产按设置中的显示币种计算，支持 `JPY`、`CNY`、`USD`。
- 手动维护汇率，并在 Dashboard / Chart 中参与换算。
- 资产记录管理：新增、编辑、删除、复制。
- 资产类型管理：新增、编辑、删除，并支持 `Region` 字段。
- `Add New Rebalance`：从最新资产快照复制资产类型和币种，录入新日期的最新金额。
- 按日期聚合的资产柱状图（Canvas）。
- Settings 支持语言、显示币种、FX 缓存天数、手动汇率、本地导入/导出。
- 本地 `.db` 导入会校验数据库；旧版本导出的数据库可通过 migration 兼容新版 schema。
- 多语言界面：中文、English、日本語。

## 数据与兼容性

- 数据保存在本地 SQLite 数据库中。
- 开发环境默认数据库位置：`data/assets.db`。
- 打包后的 macOS 应用使用 Electron `userData` 目录中的 `assets.db`。
- 新版数据库 migration 位于 `main/migrations/`。
- 当前版本保留旧 `assets.name` 列以兼容旧数据，但 UI 已不再显示或编辑 Asset Name。
- `asset_types.region` 是新版字段，旧库导入后会通过 migration 补齐。

## 技术栈

- Electron 26
- SQLite（通过 `sql.js`）
- React 18（本地静态运行时文件）
- Canvas chart
- Vanilla CSS，按 `renderer/styles/` 模块化组织

## 项目结构

```text
main/                    Electron 主进程、数据库与服务逻辑
main/migrations/          SQLite migration SQL
preload.js                Renderer 可调用的安全 API
renderer/*.html           各页面 HTML 壳
renderer/app-react.js     轻量 React 启动入口
renderer/src/             Renderer React 模块
renderer/src/pages/       Dashboard / Assets / Settings 等页面组件
renderer/src/components/  App shell、导航、页脚等共享组件
renderer/styles/          tokens / reset / base / layout / components / pages 样式
openspec/changes/         功能与重构规格说明
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

## 打包

```bash
npm run pack
```

生成正式安装包：

```bash
npm run dist
```

## macOS DMG 安装提示

如果你从 GitHub Release 下载 `.dmg` 安装后遇到 “app is damaged and can’t be opened” 提示，可执行：

```bash
xattr -dr com.apple.quarantine /Applications/Asset\ Manager.app/
```

## License

MIT
