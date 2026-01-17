---
name: upgrade
description:
  使用 AI 驱动的语义分析智能升级 claudesidian,在保留用户自定义的同时添加新功能
allowed-tools: [Read, Write, Edit, MultiEdit, Bash, WebFetch, Grep, Glob]
argument-hint:
  "(可选) 'check' 预览更改,'force' 跳过确认"
---

# 智能升级命令

通过从 GitHub 获取最新版本并使用 AI 驱动的语义分析将新功能与现有自定义合并,智能升级您的 claudesidian 安装。在添加新功能的同时保留用户意图。

## 任务

1. 检查 GitHub 上是否有最新的 claudesidian 版本
2. 下载并分析自您的版本以来的更改
3. 使用 Claude 的语义理解识别用户自定义
4. 智能地将新功能与现有自定义合并
5. 安全地应用更新,同时保留用户数据和偏好设置
6. 创建备份并提供回滚选项

## 流程

### 1. **版本检查与设置**

- 从 package.json 获取当前版本
- 检查是否已经是最新版本:

  ```bash
  # 使用 cut 而不是 sed 以避免 zsh 括号转义问题
  CURRENT=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
  LATEST=$(curl -s https://raw.githubusercontent.com/heyitsnoah/claudesidian/main/package.json | grep '"version"' | head -1 | cut -d'"' -f4)

  if [ "$CURRENT" = "$LATEST" ]; then
    echo "✅ You're already on the latest version ($CURRENT)"
    exit 0
  fi
  ```

- 在 `.backup/upgrade-YYYY-MM-DD-HHMMSS/` 中创建带时间戳的备份:

  ```bash
  # 创建备份目录
  BACKUP_DIR=".backup/upgrade-$(date +%Y-%m-%d-%H%M%S)"
  mkdir -p "$BACKUP_DIR"

  # 将所有重要文件复制到备份
  cp -r .claude "$BACKUP_DIR/"
  cp -r .scripts "$BACKUP_DIR/"
  cp package.json "$BACKUP_DIR/"
  cp CHANGELOG.md "$BACKUP_DIR/" 2>/dev/null || true
  cp README.md "$BACKUP_DIR/" 2>/dev/null || true

  echo "✅ Backup created in $BACKUP_DIR"
  ```

- 将最新的 claudesidian 克隆到临时目录(不影响用户的仓库):
  ```bash
  # 在 .tmp 目录中获取新副本 (对 Obsidian 隐藏) - 用户的仓库保持断开连接
  git clone --depth=1 --branch=main https://github.com/heyitsnoah/claudesidian.git .tmp/claudesidian-upgrade
  ```
- 现在我们有了最新版本进行比较

### 2. **创建升级检查清单**

- 比较当前目录与 .tmp/claudesidian-upgrade/ 之间的系统文件:

  ```bash
  # 查找所有不同的系统文件以及上游中的新文件
  # 首先,查找存在于两者中但不同的文件
  diff -qr . .tmp/claudesidian-upgrade/ --include="*.md" --include="*.sh" --include="*.json" |
  grep -E '(\.claude/|\.scripts/|package\.json|CHANGELOG\.md|README\.md)' |
  grep -v '(00_|01_|02_|03_|04_|05_|06_|\.obsidian|CLAUDE\.md)'

  # 还要查找上游中的新文件(如新命令)
  find .tmp/claudesidian-upgrade/.claude/commands -name "*.md" | while read f; do
    local_file=${f#.tmp/claudesidian-upgrade/}
    [ ! -f "$local_file" ] && echo "NEW: $local_file"
  done
  ```

- 创建需要审查的文件清单
- 明确排除:
  - 用户内容文件夹 (00_Inbox、01_Projects 等)
  - 用户的 CLAUDE.md(他们的个性化版本)
  - vault-config.json(用户的仓库配置)
  - .obsidian/(用户的 Obsidian 设置)
  - 根目录中的任何 .md 文件,除了 README 和 CHANGELOG
- 仅使用不同的系统文件创建 `.upgrade-checklist.md`
- 用状态标记每个文件: `[ ] 待处理`、`[x] 已更新`、`[-] 已跳过`
- 按类型分组文件以便于审查:

  ```markdown
  ## Commands (12 个文件)

  [ ] .claude/commands/init-bootstrap.md [ ] .claude/commands/release.md [ ]
  .claude/commands/thinking-partner.md ...

  ## Settings (2 个文件)

  [ ] .claude/settings.json [ ] .claude/settings.local.json

  ## Core Files (3 个文件)

  [ ] package.json [ ] CHANGELOG.md [ ] README.md
  ```

### 3. **逐文件审查**

**⚠️ 关键实施要求:**

- **绝不盲目覆盖文件,必须先显示差异**
- **始终先向用户显示差异**
- **始终在替换文件之前请求确认**
- **跳过这些步骤可能会丢失用户自定义!**
- **绝不使用 `cp` 或 `cp -f`(两者都可能导致受保护文件的提示)**
- **始终使用 `cat source > dest` 进行保证的非交互式替换**
- **等待实际的用户输入 - 不要自动选择选项 1**

对于清单中的每个文件:

1. 从 `.upgrade-checklist.md` 读取当前清单状态
2. **强制: 显示本地和上游之间的差异**:
    ```bash
    # 始终向用户显示此内容!
    diff -u current/file .tmp/claudesidian-upgrade/file
    ```
3. 确定更新策略:
    - **无本地更改**: 从上游直接替换
    - **永不更新**: 用户的 CLAUDE.md、vault-config.json、.mcp.json
    - **检测到本地更改**: 询问用户:

      ```
      文件: .claude/commands/thinking-partner.md 有本地修改

      选项:
      1. 保留您的版本(跳过更新)
      2. 采用上游版本(丢失您的更改)
      3. 查看差异并决定
      4. 尝试合并两者(AI 辅助)

      选择 (1/2/3/4): [等待用户输入数字并按回车]
      ```

      **重要**: 实际上等待用户输入他们的选择!不要自动选择任何选项。用户必须手动输入 1、2、3 或 4 并按回车。

4. 应用所选策略:
    - **对于选项 1(应用更新/采用上游)**:
      ```bash
      # 重要: 首先检查文件是否存在,然后使用 cat 和重定向
      if [ -f ".tmp/claudesidian-upgrade/path/to/file" ]; then
        cat .tmp/claudesidian-upgrade/path/to/file > path/to/file && echo "✅ Updated"
      else
        echo "⚠️ File not found in upstream - keeping local version"
      fi
      ```
    - **对于选项 2(保留您的版本)**:
      ```bash
      echo "✅ Kept your version"
      ```
    - **对于选项 4(AI 合并)**: 读取两个文件并创建合并版本
5. **关键: 立即更新清单文件**:
    ```markdown
    [ ] .claude/commands/init-bootstrap.md → 变成 → [x]
    .claude/commands/init-bootstrap.md
    ```
6. 每次文件更新后保存 `.upgrade-checklist.md`
7. 移动到下一个文件

### 4. **更新类型**

- **安全替换**: `.claude/commands/*.md`、`.claude/agents/*.md`、
  `.scripts/*`
- **需要审查**: `package.json`(保留用户自定义脚本)
- **永不触及**: 用户内容文件夹、CLAUDE.md、API 配置

#### 相似文件的批量更新

对于只有格式更改的命令,您可以批量更新:

```bash
# 批量更新多个具有相同类型更改的命令文件
for file in thinking-partner.md daily-review.md inbox-processor.md; do
  if [ -f ".tmp/claudesidian-upgrade/.claude/commands/$file" ]; then
    cat ".tmp/claudesidian-upgrade/.claude/commands/$file" > ".claude/commands/$file"
    echo "✅ Updated $file"
  fi
done
```

#### 处理缺失的上游文件

某些文件可能在本地存在但不在上游中(如已弃用的代理):

```bash
# 在尝试更新之前检查文件是否在上游中存在
if [ ! -f ".tmp/claudesidian-upgrade/$filepath" ]; then
  echo "⚠️ $filepath not in upstream - keeping local version"
  # 在清单中标记为跳过: [-]
fi
```

### 5. **进度跟踪**

- 使用 TodoWrite 工具与清单一起跟踪进度
- 在 `.upgrade-checklist.md` 中保存每个文件后的进度
- **必须在清单中标记项目**:
  - `[x]` = 已完成
  - `[-]` = 已跳过(用户自定义)
  - `[ ]` = 仍待处理
- 如果中断,可以从中断处恢复
- 显示进度: "正在更新文件 5/23..."
- 清楚地显示已完成和剩余的内容

### 6. **验证检查**

- 对照清单重新检查所有系统文件
- 与清单比较以识别:
  - 标记为 `[ ]` 待处理的文件 = 可能遗漏(问题)
  - 标记为 `[-]` 跳过的文件 = 有意保持不同(正常)
  - 标记为 `[x]` 已更新但仍在差异中的文件 = 合并问题或用户编辑
    (需要审查)
- 显示验证结果:
  ```
  ✅ 所有必要文件已成功更新
  ℹ️ 2 个文件有意保留用户自定义:
  - .claude/commands/thinking-partner.md (用户的简洁风格)
  - package.json (保留用户自定义脚本)
  - 或 -
  ⚠️ 警告: 2 个文件似乎被遗漏(仍标记为待处理):
  - .claude/commands/release.md
  - .scripts/vault-stats.sh
  ```
- 仅在清单中仍标记为 `[ ]` 待处理的文件才标记为问题

### 7. **最后步骤**

- 更新 package.json 中的版本
- 验证所有命令是否工作
- 清理临时目录: `rm -rf .tmp/claudesidian-upgrade`
- 保存最终清单以供参考(显示更新与跳过的内容)
- 显示更新摘要

## 更新类别

### 🤖 AI 驱动的智能合并

**命令** (`.claude/commands/*.md`):

- 分析用户的提示风格、输出偏好、工作流修改
- 将新功能与现有自定义合并
- 保留用户的语气、结构和特定要求

**代理** (`.claude/agents/*.md`):

- 理解用户的交互偏好
- 将新功能与现有个性结合
- 维护用户已建立的工作流

**模板** (`06_Metadata/Templates/*.md`):

- 保留自定义字段和结构
- 添加新模板功能
- 维护用户的格式偏好

### ⚡ 自动安全更新

- **新命令/代理**: 纯添加,无冲突
- **脚本** (`.scripts/*`): 实用函数,安全替换
- **依赖项** (`package.json`): 安全和功能更新
- **文档**: README、CONTRIBUTING 更新

### 🛡️ 永不修改

- **用户内容**: 所有 `00_*` 到 `06_*` 文件夹(模板除外)
- **个人配置**: 用户的 `CLAUDE.md`
- **API 密钥**: `.mcp.json`、环境变量
- **Git 历史**: 用户的提交和分支

## 智能冲突解决

当 Claude 检测到冲突时:

### 示例场景:

**场景 1: 命令增强**

```
📝 thinking-partner 命令有更新:

您的版本: 自定义简洁输出格式,特定行业重点
新版本: 添加了视频分析功能,改进的提问流程

🤖 智能合并建议:
✅ 保留您的简洁输出风格
✅ 保留您的行业特定提示
✅ 添加新的视频分析功能
✅ 集成改进的提问(适​​应您的风格)

选项:
1. 🎯 应用智能合并(推荐)
2. 👀 先显示详细差异
3. 🚫 跳过此更新
4. 💾 替换为新版本(备份您的)
```

**场景 2: 模板更新**

```
📋 项目模板有更改:

您的版本: 添加了客户信息、预算跟踪的自定义字段
新版本: 增强的元数据结构,新的自动化钩子

🤖 智能合并建议:
✅ 保留您的自定义客户/预算字段
✅ 添加新的元数据增强
✅ 集成自动化钩子
✅ 维护您的字段排序

应用合并? (y/n/preview)
```

## 命令用法

### 预览模式(推荐首次运行)

```
/upgrade check
```

- 显示将要更新的内容
- 显示智能合并预览
- 不对文件进行任何更改
- 任何时间运行都安全

### 交互式升级

```
/upgrade
```

- 每个更改逐步确认
- 显示修改文件的前后对比
- 允许选择性应用更新
- 创建自动备份

### 批量升级(高级)

```
/upgrade force
```

- 自动应用所有安全更新
- 仍然会提示复杂的合并
- 对熟悉该过程的用户更快
- 在开始之前创建完整备份

## 安全功能

### 自动备份

- 在任何更改之前完整备份: `.backup/upgrade-[timestamp]/`
- 每次修改的单个文件备份
- 备份包括当前的 git 状态和未提交的更改

### 回滚支持

```
# 如果升级导致问题:
/rollback-upgrade [timestamp]
# 从特定备份恢复
```

### 验证步骤

- 升级后功能测试
- 命令验证(运行测试命令)
- MCP 服务器连接检查
- Git 仓库完整性验证

### 增量应用

- 一次更新一个文件
- 每次关键更改后验证
- 在第一个错误时停止并显示清晰诊断
- 易于识别哪个更改导致了问题

## 避免的常见陷阱

### ⚠️ 选择性更新问题

**永远不要仅根据发行说明挑选文件!** 这会导致:

- 缺少关键命令更新
- 功能实现不完整
- 文件之间的依赖关系损坏
- 用户无法获得所有改进

**始终使用 `git diff HEAD upstream/main --name-only`** 获取更改文件的完整列表,然后系统地更新所有相关文件。

## 错误处理

### 常见场景

- **无网络连接**: 优雅失败,提供离线选项
- **GitHub API 速率限制**: 智能重试和退避
- **合并冲突**: 清楚解释和手动解决选项
- **权限问题**: 有关修复文件权限的有用指导

### 恢复选项

- **部分失败**: 从最后成功的步骤继续
- **完全失败**: 完全回滚到升级前状态
- **Git 冲突**: 将上游更改与本地提交合并
- **依赖问题**: 回退到以前的工作版本

## 高级功能

### 自定义合并规则

用户可以创建 `.upgrade-rules.json` 来指定:

- 始终跳过的文件
- 自定义合并偏好
- 特定更改类型的自动批准
- 备份保留策略

### 与 Git 集成

- 分别提交每个主要更改
- 描述更新的有意义的提交消息
- 保留用户的分支结构
- 智能处理 git 冲突

### 选择性更新

```
/upgrade commands-only    # 仅更新命令
/upgrade agents-only      # 仅更新代理
/upgrade scripts-only     # 仅更新脚本
/upgrade deps-only        # 仅更新依赖项
```

## 正确的实施示例

**这应该是升级的工作方式:**

```bash
📄 文件 1/3: .claude/commands/release.md

# 步骤 1: 始终先显示差异
检查差异...

--- .claude/commands/release.md
+++ .tmp/claudesidian-upgrade/.claude/commands/release.md
@@ -58,6 +58,11 @@

 ### Semantic Versioning (MAJOR.MINOR.PATCH)

+**Quick Decision Guide:**
+- Can users do something they couldn't do before? → **MINOR**
+- Did something that worked break? → **MAJOR** (if breaking) or **PATCH** (if fixing)
+- Did something that worked get better? → **PATCH**
+
 **MAJOR** (1.0.0 → 2.0.0):

# 步骤 2: 询问用户要做什么
此文件有可用更新。您想做什么?

1. 应用更新(采用上游版本)
2. 保留您的版本(跳过此更新)
3. 再次查看完整差异
4. 尝试合并更改(AI 辅助)

您的选择 (1-4): 1

正在应用更新...
[x] 已更新 .claude/commands/release.md
```

**错误的实施(测试中发生的情况):**

```bash
📄 文件 1/3: .claude/commands/release.md

# 未显示差异 - 错误!
# 只是盲目覆盖:
Bash(cat .tmp/claudesidian-upgrade/.claude/commands/release.md > .claude/commands/release.md)

# 无用户确认 - 错误!
# 可能丢失自定义!
```

## 示例会话

```
> /upgrade

🔍 检查更新...
📦 当前版本: 0.8.2
🆕 最新版本: 0.8.3

💾 创建备份到 .backup/upgrade-2025-09-13-142030/

📋 创建升级检查清单...
仅检查系统文件(不是您的个人笔记)...
发现 15 个系统文件有可用更新

已创建 .upgrade-checklist.md 以跟踪更新:

## Commands (8 个文件)
[ ] .claude/commands/init-bootstrap.md
[ ] .claude/commands/release.md
[ ] .claude/commands/thinking-partner.md
[ ] .claude/commands/upgrade.md
[ ] .claude/commands/daily-review.md
[ ] .claude/commands/inbox-processor.md
[ ] .claude/commands/research-assistant.md
[ ] .claude/commands/weekly-synthesis.md

## Settings (1 个文件)
[ ] .claude/settings.json

## Core Files (3 个文件)
[ ] package.json
[ ] CHANGELOG.md
[ ] README.md

## Scripts (3 个文件)
[ ] .scripts/vault-stats.sh
[ ] .scripts/firecrawl-scrape.sh
[ ] .scripts/setup-mcp.sh

开始逐文件审查...

📄 文件 1/15: .claude/commands/init-bootstrap.md
   状态: 未检测到本地更改
   操作: 从上游直接更新
   [x] 已更新

📄 文件 2/15: .claude/commands/release.md
   状态: 未检测到本地更改
   操作: 从上游直接更新
   [x] 已更新

📄 文件 3/15: .claude/settings.json
   状态: 有本地更改(您的自定义钩子)
   显示差异...
   操作: 需要合并 - 保留您的钩子,添加新功能
   [x] 已合并

[... 继续处理所有文件 ...]

🔍 **验证检查**
重新检查任何遗漏的系统文件...

✅ 所有系统文件已成功更新!
没有 claudesidian 系统文件与上游不同步。

🎉 升级完成!
📈 claudesidian 0.8.2 → 0.8.3

✅ 已更新: 14 个文件
⏭️ 已跳过: 1 个文件(CLAUDE.md - 用户自定义)
✅ 已验证: 所有系统文件与上游匹配

更改摘要:
- 修复了 init-bootstrap vault 选择
- 改进了 SessionStart 钩子
- 增强了用户识别提示
- 更新了所有命令到最新版本
```

### 示例: 验证捕获遗漏的文件

```
🔍 **验证检查**
重新检查任何遗漏的系统文件...

⚠️ 警告: 2 个文件似乎被遗漏(在清单中仍标记为待处理):
- .claude/commands/thinking-partner.md [ ]
- .scripts/vault-stats.sh [ ]

这些文件尚未处理。

您想完成这些文件的升级吗? (y/n) > y

📄 完成遗漏文件的升级...

📄 文件: .claude/commands/thinking-partner.md
   状态: 审查差异...
   操作: 从上游直接更新
   [x] 已更新

📄 文件: .scripts/vault-stats.sh
   状态: 审查差异...
   操作: 从上游直接更新
   [x] 已更新

✅ 验证完成 - 所有系统文件现在与上游匹配!
```

### 示例: 验证与用户自定义

```
🔍 **验证检查**
重新检查任何遗漏的系统文件...

与上游不同的文件:
- .claude/commands/thinking-partner.md [x] ← 已更新但用户自定义
- package.json [x] ← 已合并,保留用户自定义脚本
- .claude/commands/daily-review.md [ ] ← 尚未处理!

✅ 2 个文件有意保留用户自定义
⚠️ 1 个文件似乎被遗漏(仍待处理)

您想:
1. 审查遗漏的文件 (.claude/commands/daily-review.md)
2. 跳过验证(保持当前状态)
3. 查看有关自定义文件的详细信息

选择 (1/2/3) > 1

📄 文件: .claude/commands/daily-review.md
   状态: 审查差异...
   操作: 从上游直接更新
   [x] 已更新

✅ 验证完成!
- 已应用所有必要更新
- 用户自定义在有意之处保留
```

这个智能升级系统利用 Claude 的语义理解提供最流畅的升级体验,同时确保不会丢失任何用户自定义。
