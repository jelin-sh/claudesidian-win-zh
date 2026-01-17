# Claudesidian: Claude Code + Obsidian 入门工具包 (Windows 中文版)

使用 Claude Code 将你的 Obsidian 仓库转变为 AI 驱动的第二大脑。

## 这是什么?

这是一个预配置的 Obsidian 仓库结构,专为与 Claude Code 无缝协作而设计,让你能够:

- 使用 AI 作为思考伙伴,而不仅仅是写作助手
- 使用 PARA 方法组织知识
- 使用 Git 进行版本控制
- 从任何地方访问你的仓库(包括移动设备)

## 快速开始

### 1. 获取入门工具包

**选项 A: 使用 Git 克隆**

```bash
# 使用你喜欢的文件夹名称克隆(将 'my-vault' 替换为你想要的任何名称)
git clone https://github.com/heyitsnoah/claudesidian.git my-vault
cd my-vault

# 示例:
# git clone https://github.com/heyitsnoah/claudesidian.git obsidian-notes
# git clone https://github.com/heyitsnoah/claudesidian.git knowledge-base
# git clone https://github.com/heyitsnoah/claudesidian.git second-brain
```

**选项 B: 下载 ZIP (无需 Git)**

1. 在 GitHub 上点击 "Code" → "Download ZIP"
2. 解压到你想要的位置
3. 在 Claude Code 中打开该文件夹

### 2. 运行安装向导

**Windows 用户:**

```bash
# 双击运行
install.bat
```

**或使用命令行:**

```bash
# 在目录中启动 Claude Code
claude

# 在 Claude Code 中运行交互式设置向导
/init-bootstrap
```

这将:

- 自动安装依赖
- 断开与原始 claudesidian 仓库的连接
- **智能分析**你现有的仓库结构和模式
- **安全导入**你现有的 Obsidian 仓库到 OLD_VAULT/ (如果有的话)
- **研究你的公开作品**以获取个性化上下文(需要你的许可)
- 询问你的工作流程偏好
- 创建个性化的 CLAUDE.md 配置
- 设置你的文件夹结构
- 可选: 配置 Gemini Vision 用于图片/视频分析
- 可选: 配置 Firecrawl 用于网络研究
- 初始化 Git 用于版本控制

### 3. 在 Obsidian 中打开 (可选但推荐)

- 下载 [Obsidian](https://obsidian.md)
- 从 claudesidian 文件夹打开仓库
- 这将在 Claude Code 旁边为你提供可视化界面

### 4. 你的第一次会话

告诉 Claude Code:

```
我正在开始一个关于[主题]的新项目。
我处于思考模式,而不是写作模式。
请搜索我的仓库中任何相关的现有笔记,
然后通过提问帮助我探索这个主题。
```

或使用预配置的命令 (在 Claude Code 中):

```
/thinking-partner   # 用于协作探索
/daily-review       # 用于每日反思
/research-assistant # 用于深入研究主题
```

## 文件夹结构

```
claudesidian/
├── 00_Inbox/           # 新想法的临时捕捉点
├── 01_Projects/        # 活跃的、有时间限制的倡议
├── 02_Areas/           # 持续的职责
├── 03_Resources/       # 参考资料和知识库
├── 04_Archive/         # 已完成的项目和非活跃项目
├── 05_Attachments/     # 图片、PDF 和其他文件
├── 06_Metadata/        # 仓库配置和模板
│   ├── Reference/      # 文档和指南
│   └── Templates/      # 可重用的笔记模板
└── .scripts/           # 自动化辅助脚本
```

## 核心概念

### 思考模式 vs 写作模式

**思考模式** (研究与探索):

- Claude 提出问题以理解你的目标
- 搜索现有笔记中的相关内容
- 帮助建立想法之间的联系
- 维护洞察和进展日志

**写作模式** (内容创建):

- 基于你的研究生成草稿
- 帮助构建和编辑内容
- 创建最终交付物

### PARA 方法

**项目**: 有截止日期和具体结果

- 示例: "2025 年第四季度营销策略"
- 在 `01_Projects/` 中创建文件夹

**领域**: 持续进行,没有结束日期

- 示例: "健康"、"财务"、"团队管理"
- 存放在 `02_Areas/` 中

**资源**: 持续感兴趣的主题

- 示例: "AI 研究"、"写作技巧"
- 存储在 `03_Resources/` 中

**归档**: 非活跃项目

- 已完成的项目及其输出
- 不再相关的旧笔记

## Claude Code 命令

预配置的 AI 助手,随时可用:

- `thinking-partner` - 通过问题探索想法
- `inbox-processor` - 整理你的捕捉内容
- `research-assistant` - 深入研究主题
- `daily-review` - 每日反思
- `weekly-synthesis` - 发现一周中的模式
- `create-command` - 构建新的自定义命令
- `de-ai-ify` - 从文本中删除 AI 写作模式
- `upgrade` - 更新到最新版本的 claudesidian
- `init-bootstrap` - 重新运行设置向导
- `install-claudesidian-command` - 安装 shell 命令以从任何地方启动仓库

使用方式: 在 Claude Code 中使用 `/[命令名称]`

### 使用 `/upgrade` 保持更新

Claudesidian 会在你启动 Claude Code 时自动检查更新,
并在有新功能可用时提醒你运行 `/upgrade`。

升级命令智能合并新功能,同时保留你的自定义:

```bash
# 预览将要更新的内容(推荐先做)
/upgrade check

# 运行交互式升级
/upgrade

# 跳过确认进行安全更新(高级)
/upgrade force
```

**升级的作用:**

- 在进行任何更改之前创建时间戳备份
- 显示每个文件的差异,然后更新
- 保留你的个人笔记和自定义
- 仅更新系统文件(命令、代理、脚本)
- 永不触及你的内容文件夹(00_Inbox、01_Projects 等)
- 提供回滚能力(如果需要)

**安全特性:**

- 你的所有个人内容都受到保护
- 在 `.backup/upgrade-[时间戳]/` 中创建完整备份
- 逐文件审查和确认
- 在 `.upgrade-checklist.md` 中跟踪进度
- 可以随时停止和恢复

## 视觉与文档分析 (可选)

配置了 [Google Gemini](https://ai.google.dev/) MCP 后,Claude Code 可以
直接处理你的附件,无需描述它们。这意味着:

- **直接图片分析**: Claude 看到实际图片,而不是你的描述
- **PDF 文字提取**: 完整的文档文字,无需复制粘贴
- **批量处理**: 一次分析多个截图或文档
- **智能组织**: 基于图片内容自动生成文件名
- **比较任务**: 比较前后截图、设计等

**为什么这很重要**: 不用描述"显示错误消息的截图",
Claude Code 直接看到并读取错误。非常适合调试 UI 问题、分析图表或处理扫描文档。

**获取 Gemini API 密钥:**

1. 访问 [Google AI Studio](https://aistudio.google.com)
2. 使用你的 Google 账户登录
3. 在左侧边栏点击 "Get API key"
4. 创建新的 API 密钥(免费!)
5. 在你的环境中设置: `setx GEMINI_API_KEY "your-key-here"`

完整设置说明请参阅 `.claude/mcp-servers/README.md`

## 网络研究 (可选)

配置了 [Firecrawl](https://www.firecrawl.dev/) 后,我们的辅助脚本
直接将完整网页内容保存到你的仓库。这意味着:

- **完整文字捕获**: 脚本将完整文章文字传输到文件,而不是摘要
- **上下文保留**: Claude 不需要在内存中保存网页内容
- **批量处理**: 使用 `firecrawl-batch.bat` 一次保存多篇文章
- **清洁的 markdown**: 网页转换为可读、可搜索的 markdown
- **永久存档**: 你的研究永远保存在仓库中

**为什么这很重要**: Claude 读取网页并总结它(丢失细节),
脚本保存完整文字。然后 Claude 可以搜索和分析数千篇保存的文章,而不会达到上下文限制。非常适合研究项目、文档存档或构建知识库。

**工作流程示例:**

```bash
# 保存单篇文章
node .scripts/firecrawl-scrape.mjs "https://example.com/article" "03_Resources/Articles"

# 批量保存多个 URL
node .scripts/firecrawl-batch.mjs urls.txt "03_Resources/Research"
```

**获取 Firecrawl API 密钥:**

1. 访问 [Firecrawl](https://www.firecrawl.dev) 并注册
2. 获得 300 个免费积分开始(开源,可以自托管)
3. 转到你的仪表板查找 API 密钥
4. 复制密钥(格式: `fc-xxxxx...`)
5. 在你的环境中设置: `setx FIRECRAWL_API_KEY "fc-your-key-here"`

## 辅助脚本

使用 `pnpm` 运行这些脚本:

- `attachments:list` - 显示未处理的附件
- `attachments:organized` - 统计已整理的文件
- `attachments:sizes` - 查找大文件
- `attachments:orphans` - 查找未被引用的附件
- `vault:stats` - 显示仓库统计信息

## 高级设置

### 从任何地方快速启动

安装 shell 命令以从任何目录启动你的仓库:

```bash
# 在 Claude Code 中,运行:
/install-claudesidian-command
```

这创建一个 `claudesidian` 别名,它将:

- 自动切换到你的仓库目录
- 尝试恢复你现有的会话(如果存在)
- 回退到启动新会话
- 完成后返回原始目录

**使用方式:**

```bash
# 从终端的任何地方:
claudesidian

# 它将自动恢复你的上次会话或启动新会话
```

命令被添加到你的 shell 配置(~/.zshrc、~/.bashrc 等),因此它在终端会话之间持久存在。

### Git 集成

初始化 Git 用于版本控制:

```bash
git init
git add .
git commit -m "初始化仓库设置"
git remote add origin your-repo-url
git push -u origin main
```

最佳实践:

- 每次工作会后提交
- 使用描述性提交消息
- 开始工作前先拉取

### 移动访问

1. 设置一个小服务器(迷你 PC、云 VPS 或家庭服务器)
2. 安装 Tailscale 用于安全 VPN 访问
3. 将仓库克隆到服务器
4. 在移动设备上使用 Termius 或类似 SSH 客户端
5. 远程运行 Claude Code

### 自定义命令

通过在 `.claude/commands/` 中保存说明来创建专门的命令:

**研究助手** (`06_Metadata/Agents/research-assistant.md`):

```markdown
你是一个研究助手。

- 搜索仓库中的相关信息
- 综合来自多个来源的发现
- 识别知识差距
- 建议进一步探索的领域
```

## 提示与最佳实践

### 来自经验

1. **从思考模式开始**: 抵制立即生成内容的冲动
2. **做一个 token 极大主义者**: 更多上下文 = 更好的结果
3. **保存所有内容**: 捕捉聊天、片段、部分想法
4. **信任但要验证**: 始终阅读 AI 生成的内容
5. **打破你的流程**: AI 帮助你轻松恢复

## 故障排除

### Claude Code 找不到我的笔记

- 确保你在仓库根目录运行 Claude Code
- 检查文件权限
- 验证 markdown 文件有 `.md` 扩展名

### Git 冲突

- 开始工作前总是先拉取
- 频繁提交并带有清晰消息
- 对实验性更改使用分支

### 附件管理

- 运行 `pnpm run attachments:create-organized` 设置文件夹
- 使用辅助脚本查找孤立文件
- 保持附件在 10MB 以下以便 Git 管理

## 理念

这个设置基于关键原则:

1. **AI 放大思考,而不仅仅是写作**
2. **本地文件 = 完全控制**
3. **结构赋能创造力**
4. **迭代胜过完美**
5. **目标是洞察,而不仅仅是信息**

## 贡献

我们欢迎社区的贡献!这是一个活的模板,随着每个人的投入而变得更好。

### 如何贡献

1. **Fork 仓库**在 GitHub 上
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **进行更改**
4. **测试你的更改**以确保一切正常
5. **提交你的更改** (`git commit -m '添加惊人功能'`)
6. **推送到分支** (`git push origin feature/amazing-feature`)
7. **打开拉取请求**并清晰描述你所做的工作

### 我们在寻找什么

- **新命令**: 用于常见工作流程的有用 Claude Code 命令
- **新代理**: 用于特定任务的专业代理
- **文档改进**: 更好的说明、示例或指南
- **错误修复**: 发现了破损的东西?修复它!
- **工作流程模板**: 分享你的高效工作流程
- **辅助脚本**: 使仓库管理更容易的自动化工具
- **集成指南**: 将 Claudesidian 与其他工具连接
- **核心更新**: 改进升级系统、设置向导或其他核心功能

### 指南

- 保持命令专注和单一目的
- 编写清晰的文档和示例
- 提交前彻底测试
- 遵循现有的代码风格和结构
- 使用你的更改更新 CHANGELOG.md
- **欢迎 AI 生成的内容,但你必须在提交前仔细阅读和审查所有内容** - 永远不要提交你不理解的代码

### 获取更新

当贡献新功能并合并时,用户可以通过以下方式轻松获得:

```bash
/upgrade
```

升级命令智能合并新功能,同时保留你的个人自定义,使你可以从社区贡献中受益,而不会失去你的工作。

### 有问题或想法?

- 在开始主要工作前打开问题讨论重大更改
- 参与现有问题的讨论
- 分享你的用例 - 它们帮助我们更好地理解需求

记住:最佳实践来自使用,而不是理论。你的真实世界的经验使这对每个人都更好!

## 资源

- [Obsidian 文档](https://help.obsidian.md)
- [PARA 方法](https://fortelabs.com/blog/para/)
- [Claude Code 文档](https://claude.ai/docs)

## 灵感

这个入门工具包的灵感来自以下讨论的工作流程:

- [How to Use Claude Code as a Second Brain](https://every.to/podcast/how-to-use-claude-code-as-a-thinking-partner) -
  Noah Brier 与 Dan Shipper 的访谈
- 由 [Alephic](https://alephic.com) 团队构建 - 一家 AI 优先的策略和软件合作伙伴,通过定制 AI 系统帮助组织解决复杂挑战

## 许可证

MIT - 以你想要的任何方式使用。使其成为你自己的。

---

_记住:自行车一开始感觉摇晃,然后你忘记了它曾经很难。_
