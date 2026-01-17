---
name: init-bootstrap
description:
  交互式设置向导,帮助新用户根据其 Obsidian 工作流偏好创建个性化的 CLAUDE.md
  文件
allowed-tools: [Read, Write, MultiEdit, Bash, Task]
argument-hint: "(可选)现有仓库路径,或使用 'new' 进行全新设置"
---

# 初始化 Bootstrap 配置

此命令通过询问关于您的 Obsidian 工作流和偏好设置的问题,帮助您创建个性化的
CLAUDE.md 配置文件。

## 任务

读取 CLAUDE-BOOTSTRAP.md 模板并通过交互式收集关于用户的信息:

- 现有仓库结构(如果有)
- 工作流偏好
- 笔记风格
- 组织方法
- 特定需求

然后根据他们的需求生成定制的 CLAUDE.md 文件。

## 流程

1. **初始环境设置**
   - 使用 `date` 命令获取当前日期用于时间戳
   - 检查当前文件夹名称并询问是否要重命名
   - 如果是,引导他们完成重命名(处理父目录移动)
   - 检查 package.json 并安装依赖:
     - 首先尝试 `pnpm install`(更快、更好)
     - 如果 pnpm 不可用则回退到 `npm install`
   - 验证核心依赖已安装
   - 检查 git 状态:
     - 如果没有 .git 文件夹:初始化 git 仓库
     - 如果有远程 origin:询问开发工作
       - 个人仓库:删除 origin 和 .github 文件夹
       - 贡献者:保留 origin 和工作流完整
     - 如果是干净的本地仓库:准备就绪
   - 暂时不要创建文件夹 - 等到询问组织方法之后

2. **检查现有配置**
   - 查找现有的 CLAUDE.md
   - 如果存在,询问是否要更新或重新开始
   - 检查 CLAUDE-BOOTSTRAP.md 模板

3. **收集仓库信息**
   - 在常见位置搜索现有的 Obsidian 仓库(.obsidian 文件夹)
   - 使用适当的深度限制检查这些路径:
     - `~/Documents`(最大深度 3)- 所有平台
     - `~/Desktop`(最大深度 3)- 所有平台
     - `~/Library/Mobile Documents/iCloud~md~obsidian/Documents`(最大深度 5 -
       **仅 macOS**,iCloud 仓库)
     - 主目录 `~/`(最大深度 2)- 所有平台
     - 当前目录父级(最大深度 2)- 所有平台
   - 如果找到,询问:"在 [path] 找到 Obsidian 仓库。这是您想要导入的仓库吗?"
   - 正确计算文件数:`find [path] -type f -name "*.md" | wc -l`(无深度
     限制)
   - 显示仓库大小:`du -sh [path]`
   - 如果确认,分析仓库结构:
     - 运行 `tree -L 3 -d [path]` 查看文件夹层次结构
     - 抽样 10-15 个随机笔记以了解内容类型
     - 列出 30-50 个最近文件名以检测命名模式
     - 检查每日笔记文件夹和格式
     - 通过文件数识别最活跃的文件夹
     - 检测是否使用 PARA、Zettelkasten、Johnny Decimal 或自定义
   - 如果不是正确的或未找到:
     - **仅在 macOS 上:**询问:"您的仓库存储在 iCloud Drive 中吗?(是/否)"
     - 如果是(macOS):"请输入您仓库的完整路径(例如,
       ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/YourVault)"
     - 如果否,或在 Linux/Windows 上:"请输入您现有仓库的路径,
       或输入 'skip' 以全新开始"
     - **验证用户提供的路径**(参见下面的"用户路径验证"部分)
   - 如果没有现有仓库或用户跳过,他们将从全新的开始

4. **询问配置问题**
   - "您叫什么名字?"(用于个性化)
   - "您希望我研究您的公开作品以更好地了解您的背景吗?"
     - 如果是:搜索信息
     - 始终显示发现并询问"这是否正确?"以确认
     - 如果找到多个人,编号列出供选择
     - 如果是错误的人,提供再次搜索或跳过
     - 保存关于其工作、写作风格、专业领域的相关背景
   - "您遵循 PARA 方法还是使用其他组织系统?"
   - "您的主要用例是什么?(研究、写作、项目管理、
     知识库、每日笔记)"

   **如果使用 PARA,询问特定的设置问题:**
   [Tiago Forte 的 PARA 方法](https://fortelabs.com/blog/para/)
   - "您正在进行哪些活跃项目?"(在 01_Projects 中创建文件夹)
   - "您维护哪些职责领域?"(例如,工作、健康、
     财务、家庭)
   - "您经常研究哪些主题?"(在 03_Resources 中设置)
   - "您最近完成了哪些项目?"(可以使用摘要归档)

   **一般偏好:**
   - 检查 .obsidian/community-plugins.json 以查看他们使用的插件
   - 分析现有文件以自动检测命名约定
   - 检查附件文件夹以查看他们是否处理媒体文件
   - "您使用 git 进行版本控制吗?"
   - "您有哪些特定的网站或资源经常参考?"
   - "您有什么特定的写作风格偏好吗?"
   - "您希望 Claude 遵循哪些工作流或模式?"
   - "您想要每周审查仪式吗?(例如,周四项目审查)"
   - "您更喜欢'思考模式'(问题/探索)还是'写作模式'?"

5. **可选工具设置**

   **Gemini Vision(已包含)**
   - 询问:"Gemini Vision 已包含用于分析图片、PDF 和
     视频。您想激活它吗?(是/否/稍后)"
   - 说明:"您只需要来自 Google 的免费 API 密钥。这可以让 Claude
     分析您仓库中的任何视觉内容。"
   - 如果稍后:"没问题!您可以随时运行
     `/setup-gemini` 进行设置"
   - 如果是:
     - 引导从 https://aistudio.google.com/apikey 获取 API 密钥(免费,需要
       30 秒)
     - 帮助添加到 shell 配置文件(.zshrc、.bashrc 等)
     - 运行
       `claude mcp add --scope project gemini-vision node .claude/mcp-servers/gemini-vision.mjs`
     - 使用 API 密钥配置 .mcp.json
     - 使用示例命令测试连接

   **Firecrawl(已包含)**
   - 询问:"Firecrawl 已包含用于网络研究。您想设置它吗?
     (是/否/稍后)"
   - 说明:"这对研究来说是一个游戏规则改变者!当您找到文章或
     网站时,您可以直接将其保存为 markdown 到您的仓库 - 永久
     保留内容,使其可搜索,并让 Claude 分析它。
     非常适合构建研究库。"
   - 示例:"只需告诉 Claude:'将这篇文章保存到我的仓库:[URL]',就
     完成了!"
   - 如果稍后:"您可以随时运行 `/setup-firecrawl` 进行设置"
   - 如果是:
     - 引导从 https://firecrawl.dev 获取 API 密钥(提供免费层)
     - 帮助配置 .scripts/ 中的脚本
     - 显示示例用法:`.scripts/firecrawl-scrape.sh https://example.com`

6. **生成自定义配置**
   - 获取当前日期:`date +"%B %d, %Y"` 用于 CLAUDE.md 标题
   - 将偏好保存到 `.claude/vault-config.json`:
     ```json
     {
       "user": {
         "name": "Jane Smith",
         "background": {
           "companies": ["Variance", "Percolate"],
           "roles": ["Co-founder", "Writer"],
           "publications": ["Why Is This Interesting?", "every.to"],
           "expertise": [
             "Developer tools",
             "Marketing tech",
             "Systems thinking"
           ],
           "interests": ["AI for thinking", "Note-taking systems", "Creativity"]
         },
         "profileSources": [
           "https://whyisthisinteresting.com/about",
           "https://every.to/@username"
         ],
         "customContext": "专注于 AI 作为思维增强,而不仅仅是写作",
         "publicProfile": true
       },
       "vaultPath": "/path/to/existing/vault",
       "fileNamingPattern": "detected-pattern",
       "organizationMethod": "PARA",
       "primaryUses": ["research", "writing", "projects"],
       "tools": {
         "geminiVision": true,
         "firecrawl": false
       },
       "projects": ["Book - Productivity", "SaaS App"],
       "areas": ["Newsletter", "Health"],
       "importedAt": "2025-01-13",
       "lastUpdated": "2025-01-13"
     }
     ```
   - 以 CLAUDE-BOOTSTRAP.md 为基础
   - 添加用户特定部分:
     - 包含其实际项目/领域的自定义文件夹结构
     - 个人工作流
     - 首选工具和脚本
     - 特定指南
     - MCP 配置(如果已设置)
   - 包含他们的网站/资源(如果提供)
   - 添加任何自定义命名约定
   - 预填充他们的项目和领域:
     - 在 01_Projects/ 中创建项目文件夹
     - 在 02_Areas/ 中创建领域文件夹
     - 在 03_Resources/ 中创建资源主题
     - 添加 README 文件说明每个项目/领域

7. **导入现有仓库(如果适用)**
   - 如果用户有现有仓库:
     - 创建 OLD_VAULT 文件夹:`mkdir OLD_VAULT`
     - 复制整个仓库保留结构:
       `cp -r [vault-path]/* ./OLD_VAULT/`
     - 复制 Obsidian 配置:`cp -r [vault-path]/.obsidian ./`
     - 检查并复制其他重要文件:
       - `.trash/`(Obsidian 的回收站文件夹)
       - `.smart-connections/`(如果使用该插件)
       - 任何工作区文件:`.obsidian.vimrc` 等
     - 跳过复制:`.git/`(他们有自己的)`.claude/`(使用我们的)
     - 显示摘要:"已将您的仓库导入到 OLD_VAULT/(X 个文件,Y 个文件夹)"
     - 说明:"您的原始结构保留在 OLD_VAULT 中。您可以
       根据需要逐步将文件迁移到 PARA 文件夹。"

8. **创建支持文件**
   - 如果是新仓库则生成初始文件夹结构
   - 为主要文件夹创建 README 文件
   - 为每个项目文件夹创建子文件夹:
     - Research/(源材料)
     - Chats/(AI 对话)
     - Daily Progress/(运行日志)
   - 创建 05_Attachments/Organized/ 目录
   - 如果使用 git 则设置 .gitignore(包括 .mcp.json、node_modules)
   - 如果需要则创建初始模板
   - 如果用户想要审查仪式则创建 WEEKLY_REVIEW.md
   - 如果存在则删除 FIRST_RUN 标记文件
   - 如果初始化了仓库则进行初始 git 提交

9. **运行测试命令**
   - 执行 `pnpm vault:stats` 以验证脚本工作
   - 如果文件夹存在则测试附件命令
   - 如果已配置则测试 MCP 工具
   - 验证 git 正确跟踪文件

10. **提供后续步骤**

- 创建和配置的内容摘要
- 针对其设置的快速入门指南
- 他们可以使用的可用命令列表
- 验证一切工作的测试命令
- 基于其用例的首批任务建议
- 如何稍后修改配置

## 示例输出

```markdown
# 您的 Obsidian 仓库配置

生成日期:[运行 `date +"%B %d, %Y"` 获取当前日期] 最后更新:[相同
日期] 基于您的偏好:[主要用例] 设置完成:✅
依赖项 ✅ 文件夹结构 ✅ Git 已初始化

## 您的自定义文件夹结构

[具有说明的其特定结构]

## 您的工作流

### 日常例程

[基于他们的回答]

### 项目管理

[他们的特定方法]

### 研究方法(Noah Brier 风格)

- 捕获您阅读的所有内容
- 让重要的想法自然浮现
- 从写作开始以测试理解
- 使用搜索而非标签来查找内容
- [从 Noah 的系统了解更多](https://every.to/superorganizers/ceo-by-day-internet-sleuth-by-night-267452)

### 每周审查仪式

[如果启用:每周四下午 4 点,审查所有项目]

## 您的偏好

### 文件命名

- 模式:[他们的约定]
- 示例:[具体示例]

### 工具和脚本

[与其工作流相关的脚本]

## MCP 服务器(如果已配置)

### Gemini Vision

- 状态:✅ 已配置和测试
- API 密钥:在 .mcp.json 中设置
- 测试:`使用 gemini-vision 分析 [图片路径]`

## 可用命令

### 仓库管理

- `pnpm vault:stats` - 显示仓库统计信息
- `pnpm attachments:list` - 列出未处理的附件
- `pnpm attachments:organized` - 统计已整理的文件

### Claude 命令

- `claude run thinking-partner` - 协作思考模式
- `claude run daily-review` - 审查您的一天
- `claude run init-bootstrap` - 重新运行此设置

## 快速入门

1. [个性化第一步]
2. [基于其目标的下一步操作]
3. [特定于其工作流]

## 研究大师的专业提示

- **做一个 token 极致主义者**:为 Claude 提供大量背景信息
- **写作可扩展**:记录所有内容以供将来参考
  ([Noah Brier](https://every.to/superorganizers/ceo-by-day-internet-sleuth-by-night-267452))
- **信任涌现**:重要的想法会不断浮现
- **从写作开始**:始终以文本形式开始项目
- **定期审查**:每周留出时间进行修剪和更新
- **PARA 方法**:项目、领域、资源、归档
  ([Tiago Forte](https://fortelabs.com/blog/para/))

## 设置摘要

✅ 已安装依赖项(pnpm/npm) ✅ 已创建文件夹结构 ✅ Git
仓库已初始化并已与原始仓库断开连接 ✅ CLAUDE.md 已个性化
✅ 首次运行设置已完成 [✅ 已配置 MCP Gemini Vision - 如果已设置] [✅
首次提交已完成 - 如果已初始化 git]
```

## 重要实现说明

### 处理多个仓库

当检测到多个仓库时:

1. **始终列出找到的所有仓库**并带有清晰的编号和详细信息
2. **需要明确选择** - 不要假设使用哪个仓库
3. **在继续导入之前确认选择**
4. **处理模棱两可的响应** - 如果用户提供不清楚的输入(例如粘贴
   截图),询问澄清:
   - "我看到您分享了截图。请输入您想要导入的仓库的编号(1-3)"
   - "我需要明确的选择。请输入 '1'、'2' 或 '3' 选择一个仓库,
     或 'skip' 全新开始。"

### 没有明确确认绝不继续

如果用户的响应不清楚:

- 不要猜测或假设
- 请求明确确认
- 再次提供清晰的选项
- 示例:"我想确保我导入正确的仓库。请输入您选择的编号
  (1、2 或 3)。"

### 平台兼容性

此命令设计为跨 Linux、macOS 和 Windows (WSL/Git
Bash)工作,具有特定于平台的功能:

**所有平台:**

- 搜索 ~/Documents、~/Desktop、主目录
- 标准 Obsidian 仓库检测
- 完整的仓库导入和设置

**仅 macOS:**

- iCloud Drive 仓库检测和导入
- Obsidian 的 iCloud 同步仅限于 macOS,因此在其他平台
  上禁用 iCloud 功能

**平台检测:**

```bash
# 检查平台
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - 启用 iCloud 功能
  PLATFORM="macOS"
  ICLOUD_SUPPORTED=true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  PLATFORM="Linux"
  ICLOUD_SUPPORTED=false
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  # Windows (Git Bash 或 WSL)
  PLATFORM="Windows"
  ICLOUD_SUPPORTED=false
fi
```

### iCloud 仓库搜索实现

搜索仓库时,使用此 find 命令模式:

```bash
# 标准位置(浅搜索)
# 注意:2>/dev/null 抑制来自系统目录的预期权限错误
# 如果没有找到仓库,我们将询问用户的仓库路径
find ~/Documents ~/Desktop -maxdepth 3 -type d -name ".obsidian" 2>/dev/null

# iCloud 位置(需要更深的搜索,因为嵌套结构)
# 仅在 macOS 上搜索
if [[ "$OSTYPE" == "darwin"* ]]; then
  find ~/Library/Mobile\ Documents/iCloud~md~obsidian/Documents -maxdepth 5 -type d -name ".obsidian" 2>/dev/null
fi

# 主目录(浅层以避免深度递归)
find ~ -maxdepth 2 -type d -name ".obsidian" 2>/dev/null
```

iCloud 路径需要:

- 更高的 maxdepth(5)由于嵌套的文件夹结构
- 转义路径名中的空格
- 静默错误处理(2>/dev/null),因为许多用户不会有 iCloud
- 平台检查(仅 macOS)

**错误处理说明:**权限错误被抑制(2>/dev/null),因为
在搜索系统目录时它们是预期的。如果没有找到仓库,
脚本会优雅地提示用户输入仓库路径。

### 用户路径验证

当用户手动提供仓库路径时,使用有用的错误消息彻底验证它:

```bash
# 用户提供的路径
USER_PATH="$1"

# 展开波浪线并解析为绝对路径
USER_PATH="${USER_PATH/#\~/$HOME}"
REAL_PATH=$(realpath "$USER_PATH" 2>/dev/null)

# 验证 1:路径存在
if [ -z "$REAL_PATH" ]; then
  echo "❌ 错误:路径不存在:$USER_PATH"
  echo ""
  echo "💡 建议:"
  echo "   • 检查路径中的拼写错误"
  echo "   • 确保您使用完整路径(例如,/Users/name/vault)"
  echo "   • 您可以使用 ~ 代表您的主目录(例如,~/Documents/vault)"
  exit 1
fi

# 验证 2:是目录
if [ ! -d "$REAL_PATH" ]; then
  echo "❌ 错误:不是目录:$REAL_PATH"
  echo ""
  echo "💡 路径存在但指向文件而不是文件夹。"
  exit 1
fi

# 验证 3:包含 .obsidian 文件夹
if [ ! -d "$REAL_PATH/.obsidian" ]; then
  echo "❌ 错误:不是有效的 Obsidian 仓库(没有 .obsidian 文件夹)"
  echo "   查找位置:$REAL_PATH"
  echo ""
  echo "💡 建议:"
  echo "   • 确保路径指向您的仓库根目录(不是子文件夹)"
  echo "   • 检查您至少在 Obsidian 中打开过此仓库一次"
  echo "   • 尝试不带尾部斜杠的路径"
  echo "   • 对于 iCloud:~/Library/Mobile Documents/iCloud~md~obsidian/Documents/YourVault"
  exit 1
fi

# 验证 4:可读权限
if [ ! -r "$REAL_PATH/.obsidian" ]; then
  echo "❌ 错误:无法读取仓库目录(权限被拒绝)"
  echo "   路径:$REAL_PATH"
  echo ""
  echo "💡 您可能需要:"
  echo "   • 使用以下命令检查文件权限:ls -la \"$REAL_PATH\""
  echo "   • 确保您拥有此目录"
  exit 1
fi

# 如果解析路径与输入不同,则显示
if [ "$USER_PATH" != "$REAL_PATH" ]; then
  echo "✓ 解析路径:$REAL_PATH"
fi

# 有效的仓库路径
VAULT_PATH="$REAL_PATH"
echo "✓ 找到有效的 Obsidian 仓库"
```

此验证:

- 正确将 `~` 展开到主目录
- 将符号链接和相对路径解析为绝对路径
- 检查所有基本要求(存在、是目录、有 .obsidian、
  可读)
- 提供有用的、可操作的错误消息和建议
- 显示解析路径以便用户了解正在检查的内容
- 信任用户(允许符号链接、主目录之外的路径)
- 跨平台兼容(适用于 Linux、macOS、Windows/WSL)

### iCloud 同步状态检查

当用户选择 iCloud 仓库时,检查同步状态并在需要时发出警告:

```bash
# 在用户确认仓库选择后
if [[ "$OSTYPE" == "darwin"* ]] && [[ "$vault_path" == *"iCloud"* ]]; then
  # 检查常见的 iCloud 同步指示器
  if [ -f "$vault_path/.icloud" ] || [ -f "$vault_path/.obsidian/.icloud" ]; then
    echo ""
    echo "📱 iCloud 同步通知:"
    echo "   此仓库似乎仍在从 iCloud 下载。"
    echo "   为获得最佳结果,请先在 Obsidian 中打开它以确保文件已同步。"
    echo ""
    read -p "仍要继续吗?(是/否):" sync_answer
    if [[ ! "$sync_answer" =~ ^[Yy] ]]; then
      echo "没问题!在 Obsidian 中打开仓库,然后重新运行 /init-bootstrap"
      exit 0
    fi
  else
    echo ""
    echo "📱 检测到 iCloud 仓库。如果导入似乎不完整,请确保同步已完成。"
    echo ""
  fi
fi
```

这提供了一个软警告:

- 仅在 macOS 上针对 iCloud 路径运行
- 检查指示未完成下载的占位符文件
- 如果检测到同步问题则请求确认
- 即使没有发现问题也会给出温和的提醒
- 让用户选择是否继续

## 交互式示例

````
用户:claude run init-bootstrap
助手:欢迎!我将帮助您设置个性化的 Obsidian + Claude 配置。

📅 今天的日期:[从 `date +"%B %d, %Y"` 获取]

首先,让我检查您的设置...

📁 **文件夹名称检查**
当前文件夹:claudesidian
您想将此文件夹重命名为更个性化的名称吗?(例如,my-vault、knowledge-base、obsidian-notes)
*为什么:您的仓库应该有一个对您有意义的名称 - 您每天都会看到它!*

[如果是:通过移动到父目录并返回来处理重命名]

现在正在设置您的环境...

📦 **安装依赖项**
[检查 pnpm,如果不可用则使用 npm]
[使用 pnpm/npm 安装依赖项]
*为什么:这些工具使 Claude Code 能够有效地处理您的仓库*

🔓 **仓库设置**

**您将贡献于 claudesidian 开发吗?**
- **否**(仅个人仓库) → 我将删除 GitHub 工作流并与仓库断开连接
- **是**(我想贡献) → 我将保持开发设置完整

[实现:]
```bash
# 如果用户说"否"(个人仓库):
rm -rf .github  # 删除 GitHub 工作流
git remote remove origin  # 与 claudesidian 仓库断开连接

# 如果用户说"是"(贡献者):
# 保持 .github 文件夹和 origin remote
echo "为贡献保留开发设置"
````

_为什么:个人仓库不需要 GitHub Actions,但贡献者受益于
自动化_

📂 **创建文件夹结构**[根据您选择的组织方法创建文件夹]
_为什么:良好的结构帮助您有效地组织和查找知识_

🎯 **完成设置**[检查 git 状态并删除首次运行标记] _为什么:
Git 提供版本控制,删除标记确保您不会再看到
欢迎消息_

✅ 文件夹已重命名(如果请求) ✅ 依赖项已安装 ✅ 核心文件夹
已创建 ✅ Git 仓库就绪(已与原始 claudesidian 断开连接) ✅
首次运行标记已删除

现在让我问您几个问题以自定义您的设置:

🔍 **正在搜索现有的 Obsidian 仓库...**[搜索 ~/Documents、
~/Desktop、主目录和父目录。在 macOS 上,还搜索
iCloud Drive]

### 案例 1:找到单个仓库

在以下位置找到 Obsidian 仓库:~/Documents/MyNotes 📊 仓库统计:2,517 个 markdown
文件,总大小 1.1GB 您想导入此仓库吗?

- **yes** - 导入此仓库
- **no** - 搜索不同的仓库
- **skip** - 全新开始不导入
- **path** - 手动指定不同的路径

用户:yes

### 案例 2:找到多个仓库

🔍 **找到多个 Obsidian 仓库:**

1. **~/Documents/MyNotes**(2,517 个文件,1.1GB)
   - 最后修改:2 小时前
   - 包含:每日笔记、项目、资源

2. **~/Desktop/WorkVault**(892 个文件,450MB)
   - 最后修改:3 天前
   - 包含:客户项目、会议笔记

3. **~/Documents/ObsidianVault**(156 个文件,23MB)
   - 最后修改:2 周前
   - 包含:个人笔记、草稿

**您想导入哪个仓库?**

- 输入 **1-3** 选择一个仓库
- **all** - 导入所有仓库(每个到单独的文件夹)
- **skip** - 全新开始不导入
- **path** - 手动指定不同的路径

用户:1

**确认您的选择:**您选择了:~/Documents/MyNotes (2,517 个文件,
1.1GB)

这正确吗?(是/否)

用户:yes

太好了!我将把您的仓库导入到 OLD_VAULT/,在那里它将被安全保留。
您可以按照自己的节奏将文件迁移到 PARA 文件夹。

### 案例 3:未找到仓库(平台感知)

🔍 **在常见位置未找到 Obsidian 仓库。**

**在 macOS 上:**您的仓库存储在 iCloud Drive 中吗?(是/否)

用户:yes

请输入您仓库的完整路径:(示例:~/Library/Mobile
Documents/iCloud~md~obsidian/Documents/YourVault)

用户:~/Library/Mobile Documents/iCloud~md~obsidian/Documents/MyVault

[验证路径并显示仓库统计信息]

在以下位置找到仓库:~/Library/Mobile Documents/iCloud~md~obsidian/Documents/MyVault
📊 仓库统计:1,248 个 markdown 文件,总大小 523MB

您想导入此仓库吗?(是/skip)

**在 Linux/Windows 上:**请输入您现有 Obsidian 仓库的路径,或
输入 'skip' 全新开始:(示例:~/Documents/MyVault 或
/home/user/obsidian-vault)

用户:~/Documents/MyVault

[验证路径并显示仓库统计信息]

在以下位置找到仓库:~/Documents/MyVault 📊 仓库统计:1,248 个 markdown 文件,总大小 523MB

您想导入此仓库吗?(是/skip)

📦 **正在分析您的仓库结构...**[运行 tree 查看文件夹层次结构]
[抽样笔记以了解内容] [从最近的文件检测命名模式]

我可以看到您正在使用:

- 修改后的 PARA 结构,带有自定义文件夹
- 日期前缀的文件用于每日笔记(YYYY-MM-DD)
- 带有嵌套研究的项目文件夹
- 大量使用资源文件夹用于参考材料

📦 **正在导入您的仓库...**[将文件复制到 OLD_VAULT/] [保留
.obsidian 设置] [检查插件文件夹]

✅ 已将 2,517 个文件(1.1GB)导入到 OLD_VAULT/ 您的原始结构
完全保留!

现在让我们个性化您的设置:

1. **您叫什么名字?**

   _为什么我这样问:_我将使用此信息个性化您的 CLAUDE.md 文件并帮助
   我更好地了解您的背景。这创造了更量身定制的体验,
   我可以自然地参考您的工作和兴趣。

用户:Noah Brier

2. **您希望我研究您的公开作品吗?**

   _为什么这有帮助:_通过了解您的背景、专业知识和兴趣,
   我可以:
   - 根据您的特定领域和工作流程定制建议
   - 引用您域中的相关示例
   - 更好地理解您问题的背景
   - 建立有助于我成为更有效思维伙伴的资料

用户:是

太好了!为了确保我找到关于真实您的信息,您可以提供以下任何
详细信息吗?

- 您的公司或组织
- 您的位置(城市/国家)
- 您从事的独特项目
- 您的网站或社交媒体帐户
- 任何其他区分信息

这有助于我避免与与您同名的人混淆。

用户:我共同创立了 Variance 和 Percolate,我在 every.to 写作

完美!让我使用这些详细信息搜索您...

[使用提供的识别信息搜索]

根据您的详细信息,我找到了您 - Noah Brier,Variance 和
Percolate 的联合创始人,every.to 的作家。

让我确认这是正确的:

- 共同创立了 Variance(开发工具)和 Percolate(营销软件)
- 在 every.to 和 Why Is This Interesting? 通讯写作
- 专注于系统思维、创造力和技术

这是您吗?(是/否)

用户:yes

太好了!我已经识别了正确的个人资料。

**构建您的资料**您希望我阅读任何特定页面以更好地
了解您的工作吗?

- 您的个人网站或博客
- 您最近撰写的文章或论文
- 公司/项目页面
- LinkedIn 或其他个人资料

输入 URL(逗号分隔)或 'skip' 继续:

用户:https://whyisthisinteresting.com/about, https://every.to/@noahbrier

[获取并分析提供的 URL]

我已经建立了全面的资料:

- 您共同创立了 Variance(开发工具)和 Percolate(营销软件)
- 您与 Colin Nagy 一起撰写 Why Is This Interesting? 通讯
- 您探索创造力、技术和系统思维
- 您撰写了关于写作即思维、笔记系统和 AI 的文章

关于您的工作或兴趣,还有什么我应该知道的吗?

用户:我真的对 AI 如何增强思维感兴趣,而不仅仅是写作

明白了!我会记住您专注于 AI 作为思维工具,而不仅仅是
写作助手。

3. **您将主要把此仓库用于什么?**(研究、写作、项目管理
   、每日笔记、知识库或组合?)

用户:我将把它用于研究和写作,以及管理客户项目

助手:太好了!我将为研究、写作和客户
项目管理配置您的仓库。

2. **您目前正在从事哪些具体项目?**(我将在
   01_Projects 中为每个项目创建文件夹)

用户:我正在写一本关于生产力系统的书,构建一个 SaaS 应用程序,并计划一个会议演讲

助手:完美!我将为以下项目设置项目文件夹:

- 01_Projects/Book - Productivity Systems/
- 01_Projects/SaaS App Development/
- 01_Projects/Conference Talk/

3. **您维护哪些持续的职责领域?**(这些将放在
   02_Areas - 没有结束日期的事情)

用户:我的通讯、健康与健身、个人财务和家庭活动

助手:我将为以下领域创建领域文件夹:

- 02_Areas/Newsletter/
- 02_Areas/Health & Fitness/
- 02_Areas/Finances/
- 02_Areas/Family/

4. **您经常研究或参考哪些主题?**(我将在
   03_Resources 中组织这些主题)

用户:AI 工具、生产力方法、SaaS 指标和写作技巧

助手:为以下主题设置资源文件夹:

- 03_Resources/AI Tools/
- 03_Resources/Productivity Methods/
- 03_Resources/SaaS Metrics/
- 03_Resources/Writing Techniques/

[继续提问...]

**Gemini Vision 设置**Gemini Vision 已包含在 claudesidian 中!
它可以分析您仓库中的图片、PDF 和视频。要激活它,您只需要
免费的 Google API 密钥(需要 30 秒)。您想现在设置它吗?
(是/否/稍后)

用户:稍后

没问题!您可以随时运行 `/setup-gemini` 进行设置。

**Firecrawl 设置**Firecrawl 对研究来说是一个游戏规则改变者!将任何文章
或网站直接保存为 markdown 到您的仓库。非常适合构建永久、
可搜索的研究库。您想设置它吗?(是/否/稍后)

用户:是

绝佳选择!Firecrawl 将改变您收集研究的方式。

助手:太好了!以下是获取 API 密钥的方法:

1. 访问 https://aistudio.google.com/apikey
2. 点击"Create API Key"
3. 复制密钥(以 AIzaSy... 开头)

一旦您获得它,将其粘贴到此处,我将为您配置所有内容。
