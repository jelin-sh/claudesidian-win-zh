---
allowed-tools: Write, Read, Bash(ls:*, mkdir:*), Edit
description: 创建新的 Claude Code 斜杠命令
argument-hint: [命令详细信息或描述]
---

# 创建新斜杠命令

我将帮助你创建一个新的 Claude Code 斜杠命令。

## 你的输入

**命令详细信息:** $ARGUMENTS

## 流程

1. **理解需求**
   - 命令应该做什么?
   - 需要什么工具?
   - 应该产生什么输出?

2. **设计结构**
   - 命令名称(kebab-case)
   - 所需工具
   - 输入参数
   - 输出格式

3. **创建命令文件**
   - 位置: `.claude/commands/[command-name].md`
   - 包含正确的 frontmatter
   - 清晰的说明
   - 使用示例

## 命令模板

```markdown
---
allowed-tools: [列出所需工具: Read, Write, Edit, Bash 等]
description: [一行描述]
argument-hint: [用户应该提供的内容]
---

# 命令名称

简要描述此命令的作用。

## 任务

[任务的清晰描述]

## 流程

1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

## 输出

[预期输出格式]

## 使用示例

\`\`\` claude run [command-name] [arguments] \`\`\`
```

## 最佳实践

- 保持命令专注于单个任务
- 使用清晰、描述性的名称
- 包含使用示例
- 记录所需参数
- 指定输出格式
- 在 frontmatter 中列出所需工具

让我帮助你创建命令!
