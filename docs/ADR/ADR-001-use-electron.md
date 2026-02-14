ADR-001：选择 Electron 作为桌面应用平台
状态

Accepted（已采纳）

日期：2026-02-14
决策者：Tei

背景（Context）

本项目是一个长期运行的个人资产管理系统，目标生命周期为 20 年以上。

系统核心需求：

本地运行，不依赖云服务

可跨平台运行（Mac / Windows）

可像普通应用一样双击打开

不需要用户手动运行命令行

数据完全本地保存（SQLite）

UI 可以持续改进

系统可长期维护

此前考虑的方案包括：

方案	优点	缺点
Python + 浏览器	稳定	用户体验差，需要启动 server
Node.js + 浏览器	灵活	需要 Node 环境
Web App	简单	强依赖浏览器
Go 原生 GUI	稳定	UI 开发复杂
Electron	独立运行	体积较大
决策（Decision）

选择 Electron 作为桌面应用运行平台。

Electron 将用于：

提供桌面应用外壳

嵌入 Chromium 浏览器

嵌入 Node.js runtime

加载本地 HTML UI

访问本地 SQLite 数据库

决策理由（Rationale）
1. 独立运行，不依赖系统环境

Electron 打包后包含：

Chromium

Node runtime

应用代码

用户无需安装：

Node.js

Python

任何依赖

可以直接双击运行。

2. 长期可维护性强

Electron 已被广泛使用多年，典型应用包括：

Microsoft 的 Visual Studio Code

Slack Technologies 的 Slack

Notion Labs 的 Notion

说明 Electron 适合长期维护的软件。

3. UI 开发效率高

可以使用：

HTML

CSS

JavaScript

优势：

易于修改 UI

易于未来升级

易于实现图表和可视化

4. 完全本地数据控制

Electron 可以直接访问：

assets.db


无需：

网络

云服务

符合长期数据安全目标。

5. 可移植性强

应用可以：

拷贝到新电脑直接运行

不需要重新安装环境

数据文件：

assets.db


可以直接复制迁移。

后果（Consequences）
正面影响

用户体验好（像普通 App）

无需命令行操作

UI 可持续改进

数据完全本地控制

跨平台支持

负面影响

应用体积较大（约 80–150MB）

Electron 本身依赖 Chromium

但考虑到：

本项目为长期使用

存储空间不是关键限制

此影响可接受。

替代方案（Alternatives Considered）
Python GUI（Tkinter）

优点：

标准库

缺点：

UI 现代化困难

未选用原因：

UI 扩展性差

原生 Web App

优点：

简单

缺点：

依赖浏览器

未选用原因：

用户体验较差

Go GUI

优点：

极稳定

缺点：

UI 开发复杂

未选用原因：

开发成本高

实现策略（Implementation Plan）

架构：

Electron
 ├── Main Process
 ├── Renderer Process
 ├── UI (HTML/CSS/JS)
 └── SQLite Database


数据文件：

assets.db

长期维护策略

Electron 不需要频繁升级。

策略：

每 3–5 年评估是否升级 Electron

SQLite 文件保持独立

保证数据格式长期可读

即使 Electron 停止维护，数据仍可访问。

结论（Conclusion）

Electron 在以下方面达到最佳平衡：

可用性

可维护性

用户体验

长期稳定性

因此选择 Electron 作为桌面应用平台。