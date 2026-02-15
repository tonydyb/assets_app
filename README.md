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

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动应用

```bash
npm start
```

## macOS DMG 安装提示

如果你从 GitHub Release 下载 `.dmg` 安装后遇到 “app is damaged and can’t be opened” 提示，可执行：

```bash
xattr -dr com.apple.quarantine /Applications/assets-app.app
```

## License

MIT
