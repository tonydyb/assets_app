# 中文阅读版：002-rebalance-and-asset-model-update

## 变更目标

根据 Figma 设计图和新的资产管理思路，调整资产模型和录入流程：

1. 删除用户界面里的 Asset `Name` 字段。
2. 给 Asset Type 增加 `Region` 字段。
3. 首页增加 `Add New Rebalance` 按钮，用于快速创建新一期资产快照。
4. Settings 页面保存 Preferences / FX Rates 后增加明确反馈。

这是业务功能变更，不只是 UI 调整。

## 为什么要做

当前应用更像“逐条记录资产”。新的目标更像“周期性记录资产快照”。

用户通常每隔一段时间更新同一组资产的金额，因此 Rebalance 流程比每次逐条新增资产更高效。

同时，Asset `Name` 字段在 Figma 设计和当前使用方式里不是核心信息，容易让表格变复杂。资产分类和地区信息更适合放在 Asset Type 上，所以新增 `Region`。

## 范围

包含：

- Asset UI 移除 `Name`。
- Asset Type 新增 `Region`。
- Dashboard 新增 `Add New Rebalance`。
- Rebalance 草稿从最新日期资产快照复制。
- Rebalance 默认日期为当天。
- 用户批量更新金额后保存为新日期快照。
- Settings 保存按钮增加成功/失败反馈。
- 新文案支持 `en-US`、`zh-CN`、`ja-JP`。
- 更新 docs 和 DDL/LLD。

不包含：

- 云同步。
- AWS S3 备份。
- 登录账号。
- 收费/订阅逻辑。
- AI 诊断。
- 投资建议。
- 彻底清理历史 `asset.name` 数据。

## 重要兼容策略

第一阶段不要物理删除数据库里的 `assets.name` 列。

原因：

- 旧数据库可能还包含该字段。
- 用户导入的旧 `.db` 可能还包含该字段。
- 物理删除字段属于破坏性迁移，风险更高。

本次策略是：

- UI 不显示 Name。
- 新增/编辑资产不要求 Name。
- Rebalance 不复制或展示 Name。
- 数据库字段可以继续保留，作为历史兼容字段。

## 数据模型变化

### asset_types

新增字段：

```sql
region TEXT
```

说明：

- 可为空。
- 第一阶段为自由文本。
- 示例：`Japan`、`China`、`US`、`Global`、`日本`、`中国`。

### assets

`name` 字段变为 UI deprecated：

- UI 不展示。
- UI 不编辑。
- 新写入可为 `NULL` 或空字符串。
- 不参与 Dashboard / Chart / Rebalance 计算。

## Rebalance 用户流程

1. 用户打开 Dashboard。
2. 用户点击 `Add New Rebalance`。
3. 系统查找最新日期的资产快照。
4. 系统复制该日期的全部资产作为草稿。
5. 草稿日期默认设置为今天。
6. 用户修改每一项资产的最新金额。
7. 用户点击 `Save Rebalance`。
8. 系统插入一组新日期资产记录。
9. Dashboard 总资产更新为新日期快照。
10. Chart 增加新日期柱状图。

## 空状态行为

如果没有任何历史资产：

- 不进入不可用的 Rebalance 页面。
- 显示提示：请先新增资产。
- 提供跳转 Add Asset 的入口。

## Settings 保存反馈

### Save Preferences

成功：显示保存成功。  
失败：显示错误提示。

### Save FX Rates

成功：显示汇率保存成功。  
失败：显示错误提示。

反馈要求：

- 用户可见。
- 不要太快消失。
- 文案跟随当前语言。
- 保存失败时不能显示成功文案。

## 验收重点

### Asset Name

- Dashboard 不显示 Name。
- Assets 不显示 Name。
- Add Asset 不显示 Name。
- Edit Asset 不显示 Name。
- 旧数据库有 `asset.name` 时仍可打开。

### Asset Type Region

- Asset Types 列表显示 Region。
- 新增类型时可填 Region。
- 编辑类型时可修改 Region。
- Region 可为空。
- Region 支持中文/日文。
- 重启后 Region 不丢失。

### Rebalance

- Dashboard 有 `Add New Rebalance`。
- 点击后复制最新日期资产。
- 日期默认今天。
- 用户可修改金额。
- 保存后产生新日期快照。
- 上一期快照不变。
- Dashboard 和 Chart 更新。
- 防止重复点击造成重复保存。

### Settings Feedback

- Save Preferences 有成功/失败反馈。
- Save FX Rates 有成功/失败反馈。
- 反馈支持多语言。

## 推荐实现顺序

1. 更新 docs 和 OpenSpec。
2. 增加 `asset_types.region` migration。
3. 扩展 Asset Type service / IPC。
4. 移除 Asset Name UI。
5. 增加 Region UI。
6. 增加 Rebalance service / IPC。
7. 增加 Rebalance 页面或 modal。
8. 增加 Dashboard 按钮。
9. 增加 Settings 保存反馈。
10. 做 Dashboard / Assets / Asset Types / Chart / Settings 回归验证。

## 风险

- Rebalance 保存如果重复触发，可能产生重复快照。
- Region migration 必须兼容旧数据库。
- 移除 Name UI 可能让旧数据中的备注信息不可见。
- Chart 和 Dashboard 必须继续按“最新日期快照 + 汇率换算”计算。
