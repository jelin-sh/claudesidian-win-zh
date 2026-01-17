---
name: release
description:
  自动升级版本、更新变更日志、提交、标记并推送基于最近更改的新版本
allowed-tools: [Read, Write, Edit, MultiEdit, Bash, Grep]
argument-hint:
  "(可选)'major'、'minor'、'patch'或留空以自动检测"
---

# 发布命令

自动化整个发布流程:分析最近的提交以确定版本升级类型、更新 package.json 中的版本、将未发布的变更日志条目移动到新版本、提交所有内容、创建 git 标签并推送到 GitHub。

## 任务

1. 分析自上次标记以来的最近提交,以确定版本升级类型
2. 更新 package.json 中的版本
3. 将 CHANGELOG.md 中的"未发布"条目移动到新版本部分
4. 提交更改
5. 创建带注释的 git 标签
6. 将提交和标签推送到 GitHub

## 流程

1. **检查先决条件**
   - 确保在 main/master 分支上
   - 检查是否有未提交的更改
   - 验证 CHANGELOG.md 和 package.json 是否存在
   - 从 package.json 获取当前版本

2. **确定版本升级**
   - 如果提供了参数(major/minor/patch),则使用该参数
   - 否则,分析自上次标记以来的提交:
     - 查找 "BREAKING CHANGE" 或 "!" = major 升级
     - 查找 "feat:" = minor 升级
     - 查找 "fix:"、"docs:"、"chore:" = patch 升级
   - 计算新版本号

3. **更新文件**
   - 更新 package.json 中的版本
   - 将 CHANGELOG.md 中的"未发布"部分移动到新版本部分
   - 为新版本添加比较链接
   - 创建新的空"未发布"部分

4. **Git 操作**
   - 暂存更改: `git add package.json CHANGELOG.md`
   - 提交: `git commit -m "chore: release v{version}"`
   - 创建带注释的标签: `git tag -a v{version} -m "Release v{version}"`
   - 推送提交: `git push`
   - 推送标签: `git push --tags`

5. **创建 GitHub 发布**
   - 使用 `gh release create` 自动发布
   - 从 CHANGELOG.md 中提取版本部分作为发布说明
   - 包含"使用 Claude Code 生成"的页脚
   - 这确保发布在 GitHub 的发布页面可见

6. **提供确认**
   - 显示 GitHub 发布 URL
   - 确认发布成功

## 版本升级规则

### 语义版本控制(MAJOR.MINOR.PATCH)

**快速决策指南:**

- 用户可以做以前做不到的事情吗? → **MINOR**
- 以前能用的东西坏了吗? → **MAJOR**(如果是破坏性更改)或 **PATCH**(如果是修复)
- 以前能用的东西变好了吗? → **PATCH**

**MAJOR**(1.0.0 → 2.0.0):

- 需要用户更改代码/配置的破坏性更改
- 删除功能或命令
- 不兼容地更改命令语法或行为
- 提交消息正文中包含 "BREAKING CHANGE"
- 类型后带有 "!" 的提交(例如 "feat!:")

**MINOR**(1.0.0 → 1.1.0):

- 添加了**新功能**(不是对现有功能的增强)
- 使以前不可能的事情成为可能
- 新命令、新工具、新集成
- 不影响现有功能的新可选功能
- 启用新功能的重要架构更改
- 以 "feat:" 开头并添加新功能的提交
- 示例:
  - 添加新的 `/command`
  - 添加新的 MCP 服务器
  - 添加仓库导入功能(首次)
  - 使升级在没有 git 连接的情况下工作(以前是不可能的)
  - 使功能在需要互联网的情况下可以离线工作

**PATCH**(1.0.0 → 1.0.1):

- 错误修复和小改进
- 对现有功能的增强(已经可以工作的)
- 性能改进
- 文档更新
- 不改变行为的重构
- 带有 "fix:"、"docs:"、"style:"、"refactor:"、"perf:"、"test:"、"chore:" 的提交
- 示例:
  - 使现有命令更智能(但不启用新的用例)
  - 改进错误消息
  - 修复现有功能中的错误
  - 增强现有导入使其更智能
  - 改进现有功能的 UI/格式

### 提交消息最佳实践

**仅对NEW功能使用 "feat:":**

- ✅ `feat: add vault import capability`
- ❌ `feat: enhance vault import`(应该是 `fix:` 或 `refactor:`)

**对改进和更正使用 "fix:":**

- ✅ `fix: improve vault detection accuracy`
- ✅ `fix: correct file counting in init-bootstrap`

**对代码改进使用 "refactor:":**

- ✅ `refactor: enhance profile building with URL fetching`
- ✅ `refactor: make init-bootstrap questions smarter`

**对性能改进使用 "perf:":**

- ✅ `perf: optimize vault analysis for large vaults`

## 使用示例

```bash
# 从提交中自动检测版本升级
claude run release

# 强制特定版本升级
claude run release patch
claude run release minor
claude run release major

# 输出示例:
# 📦 当前版本: 0.1.0
# 🔍 分析自上次发布以来的提交...
#
# 找到的提交:
# - feat: add video support to Gemini Vision
# - docs: update README with setup instructions
# - fix: correct attachment link handling
#
# ✨ 检测到版本升级: MINOR(添加了新功能)
# 📝 新版本: 0.2.0
#
# ✅ 已更新 package.json
# ✅ 已更新 CHANGELOG.md
# ✅ 已提交更改
# ✅ 已创建标签 v0.2.0
# ✅ 已推送到 GitHub
# ✅ 已创建 GitHub 发布
#
# 🎉 发布 v0.2.0 完成!
#
# GitHub 发布: https://github.com/user/repo/releases/tag/v0.2.0
```

## 错误处理

- 如果不在 main 分支上:"请先切换到 main 分支"
- 如果有未提交的更改:"请先提交或存储更改"
- 如果自上次发布以来没有更改:"没有要发布的更改"
- 如果版本已存在:"版本 X.X.X 已存在"

## 安全功能

- 空运行模式:显示将要发生的内容而不进行更改
- 推送前确认提示
- 验证版本格式
- 创建前检查现有标签
