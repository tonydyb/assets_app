下面是标准的架构决策记录文档，可保存为：

```
docs/ADR/ADR-002-use-sqlite.md
```

---

# ADR-002：选择 SQLite 作为核心数据存储

## 状态

Accepted（已采纳）

日期：2026-02-14
决策者：Tei

---

## 背景（Context）

本项目是一个长期运行的个人资产管理系统，主要目标包括：

* 安全保存长期资产数据（20 年以上）
* 完全本地运行
* 不依赖网络或云服务
* 易于备份和迁移
* 易于维护
* 不依赖复杂数据库安装

资产数据具有以下特征：

* 数据量小（每月一条记录）
* 写入频率低（每月一次）
* 读取频率低
* 单用户访问
* 不需要并发写入

预计 20 年数据量：

```
12 条 / 年 × 20 年 = 240 条记录
```

属于极小规模数据。

---

## 决策（Decision）

选择 **SQLite 作为系统唯一核心数据存储引擎**。

所有资产数据将存储在本地文件：

```
assets.db
```

Electron 应用将直接访问 SQLite 文件进行读写。

---

## 决策理由（Rationale）

### 1. 无需安装数据库服务器

SQLite 是嵌入式数据库：

* 不需要安装
* 不需要配置
* 不需要启动服务

数据库就是一个文件：

```
assets.db
```

降低维护复杂度。

---

### 2. 长期稳定性极强

SQLite 发布于 2000 年，已有 25 年历史，由 SQLite Consortium 维护。

SQLite 的设计目标之一是：

> 数据文件格式永久稳定

SQLite 官方承诺：

> SQLite 文件格式向后兼容

意味着：

* 2026 年创建的数据库
* 2046 年仍可读取

---

### 3. 数据完全可控

数据是普通文件：

```
assets.db
```

可以：

* 复制
* 备份
* 邮件发送
* 云盘存储
* 离线存储

无需导出或转换。

---

### 4. 极低维护成本

SQLite 不需要：

* DBA
* 配置管理
* 服务监控
* 升级管理

减少长期维护成本。

---

### 5. 性能完全满足需求

资产系统负载极低：

* 每月写入 ≤ 1 次
* 每次查询 ≤ 500 条记录

SQLite 可以处理远大于此规模的数据。

性能不是限制因素。

---

### 6. 跨平台支持

SQLite 支持：

* macOS
* Windows
* Linux

数据库文件可直接跨平台使用。

Electron 可直接访问 SQLite。

---

### 7. 简单备份和恢复

备份：

```
cp assets.db backup.db
```

恢复：

```
cp backup.db assets.db
```

无需特殊工具。

---

## 后果（Consequences）

### 正面影响

* 极低维护成本
* 无需数据库服务器
* 高稳定性
* 易于备份
* 易于迁移
* 完全本地控制
* 长期数据安全

---

### 负面影响

SQLite 不适用于：

* 多用户并发写入
* 分布式系统
* 大规模数据

但本项目为：

* 单用户
* 小数据量

这些限制不构成问题。

---

## 替代方案（Alternatives Considered）

---

### MySQL

优点：

* 功能强大

缺点：

* 需要安装服务器
* 增加维护复杂度

未选用原因：

* 对本项目过于复杂

---

### PostgreSQL

优点：

* 企业级数据库

缺点：

* 需要数据库服务器
* 运维复杂

未选用原因：

* 不适合个人本地应用

---

### JSON 文件

优点：

* 简单

缺点：

* 无查询能力
* 无事务保证
* 数据完整性差

未选用原因：

* 不适合长期结构化数据

---

### CSV 文件

优点：

* 可读性强

缺点：

* 不支持事务
* 难以更新

未选用原因：

* 不适合数据库用途

---

## 实现策略（Implementation Plan）

数据库文件位置：

```
/data/assets.db
```

表结构：

```sql
CREATE TABLE monthly_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT UNIQUE NOT NULL,
  stocks REAL DEFAULT 0,
  deposit REAL DEFAULT 0,
  cash REAL DEFAULT 0,
  debt REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 数据备份策略

备份周期：

* 每月自动备份
* 每年归档备份

备份格式：

* SQLite 文件副本
* CSV 导出副本

---

## 长期维护策略

保证：

* SQLite 文件始终独立于应用代码
* 不进行破坏性 schema 修改
* 所有 schema 修改使用 migration

---

## 风险评估（Risk Assessment）

风险：SQLite 项目停止维护

概率：极低

原因：

* SQLite 被广泛使用
* 被多个大型组织使用

即使 SQLite 停止开发：

SQLite 文件格式仍可读取。

---

## 结论（Conclusion）

SQLite 提供最佳组合：

* 稳定性
* 简单性
* 可维护性
* 数据安全性

SQLite 是本项目长期数据存储的最优选择。

---

如果你愿意，我可以继续帮你写：

```
ADR-003：Local-first 架构决策
ADR-004：数据备份策略
ADR-005：不依赖云服务架构决策
```

这会形成完整的长期系统架构决策体系。
