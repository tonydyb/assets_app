# ADR-004: 不使用 node:sqlite，改用 sql.js

状态：Accepted（Updated）  
日期：2026-02-14  
决策者：Tei  
技术栈：Electron + SQLite (`sql.js`)

---

## 背景 (Context)

本系统需要本地 SQLite 数据库存储资产数据，核心要求：

- 本地单文件存储
- 无服务端依赖
- 与现有 Electron 工程兼容
- 减少平台相关编译问题

此前 ADR 文案曾计划使用 Node 官方模块 `node:sqlite`，但当前项目实际实现已经采用 `sql.js`，包括：

- `package.json` 依赖：`"sql.js": "^1.8.0"`
- 数据访问实现：`main/database.js`
- 数据文件路径：`data/assets.db`

因此需要更新 ADR，确保架构决策与代码一致。

---

## 决策 (Decision)

本项目数据库访问方案确定为：

- 使用 `sql.js`（SQLite 的 WebAssembly/JavaScript 实现）
- 不使用 `node:sqlite`

实现方式（当前代码）：

```js
const initSqlJs = require('sql.js');

DB = await initSqlJs();
db = new DB.Database(fileBufferOrEmpty);
```

写入后通过 `db.export()` 持久化到本地文件：

```js
const data = db.export();
fs.writeFileSync(dbPath, Buffer.from(data));
```

---

## 决策理由 (Rationale)

### 1. 与当前代码和依赖完全一致

项目已落地 `sql.js`，继续沿用可避免无意义重构，减少风险。

### 2. 避免 Native Addon 编译链复杂度

`sql.js` 不依赖本地 C++ addon 编译流程，跨平台交付更直接。

### 3. Electron 版本现实约束

当前项目使用 `electron@26.x`。`node:sqlite` 受 Node 版本能力约束，直接切换会带来运行时与打包兼容性不确定性。

### 4. 满足当前系统规模

本系统是个人资产管理桌面应用，数据量与并发要求较低，`sql.js` 的性能与能力可满足当前需求。

---

## 被拒绝方案 (Rejected Alternatives)

### `node:sqlite`

拒绝原因（在当前项目上下文中）：

- 与现有实现不一致，切换成本高
- 受 Node/Electron 版本组合影响，兼容性需额外验证
- 当前需求下无显著收益覆盖迁移成本

### `better-sqlite3` / `sqlite3` (npm)

拒绝原因：

- Native addon 路线，通常需要额外编译/重建流程
- Electron 版本升级时维护成本更高

---

## 后果 (Consequences)

优点：

- 与现有代码一致，风险最低
- 跨平台构建流程简单
- 继续保持 SQLite 单文件存储模式

缺点：

- 依赖第三方库（`sql.js`），不是 Node 内置模块
- 数据库写入采用导出文件方式，超大数据量场景下效率不如原生 SQLite 绑定

结论：在当前系统目标和规模下可接受。

---

## 实施说明 (Implementation)

- 初始化：`main/assetService.js` 启动时调用 `DatabaseModule.init()`
- 建表：`main/database.js` 内执行 `CREATE TABLE IF NOT EXISTS ...`
- 持久化：每次写操作后调用 `saveDb()` 将内存数据库导出到 `data/assets.db`

---

## 结论 (Summary)

ADR-004 已更新为：

- 本项目正式采用 `sql.js` 作为 SQLite 访问方案
- `node:sqlite` 不作为当前实现方案

该决策与当前代码实现、依赖和文档保持一致。
