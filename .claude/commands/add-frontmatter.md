---
description:
  添加或更新 YAML frontmatter 属性以增强笔记组织
argument-hint: [文件或文件夹路径]
allowed-tools: Read, Write, Edit, Glob
---

你将分析 Obsidian 笔记并添加智能的 YAML frontmatter 属性以增强组织和可发现性。

## 输入

- 路径: ${1} (要处理的文件或文件夹)
- 当前日期: !`date +%Y-%m-%d`

## 你的任务

### 步骤 1: 识别要处理的笔记

```bash
# 如果是单个文件
读取指定的文件

# 如果是文件夹
查找文件夹中的所有 .md 文件
```

### 步骤 2: 分析笔记内容

对于每个笔记,检查:

- 主要主题和主题内容
- 笔记类型(会议、每日、参考、项目)
- 关键实体(人物、项目、日期)
- 现有属性(保留有效的)
- 标题质量(如需要则添加/改进)

### 步骤 3: 生成适当的属性

#### 按笔记类型分类的标准属性

**会议笔记:**

```yaml
---
title: [描述性会议标题]
date: YYYY-MM-DD
type: meeting
attendees: ['人员 1', '人员 2']
project: 项目名称
tags: [meeting, project-name]
action_items:
  - '行动项 1'
  - '行动项 2'
status: complete
---
```

**每日笔记:**

```yaml
---
title: 每日笔记 - YYYY-MM-DD
date: YYYY-MM-DD
type: daily-note
tags: [daily]
highlights:
  - '关键事件或想法'
mood: productive
---
```

**参考/文章笔记:**

```yaml
---
title: [文章或概念标题]
type: reference
source: "[[来源笔记]]" 或 URL
author: 作者名称
date_saved: YYYY-MM-DD
tags: [主题1, 主题2]
key_concepts: [概念1, 概念2]
---
```

**项目笔记:**

```yaml
---
title: [项目名称 - 组件]
type: project
status: in-progress
deadline: YYYY-MM-DD
stakeholders: ['人员 1', '团队 2']
tags: [project, area]
priority: high
---
```

### 步骤 4: 应用属性

对于每个笔记:

1. 检查现有的 frontmatter
2. 合并新属性(不要重复)
3. 修复任何已弃用的格式:
   - `tag` → `tags`
   - `alias` → `aliases`
   - `cssclass` → `cssclasses`
4. 确保有效的 YAML 语法

### 步骤 5: 更新文件

```yaml
# 格式:
---
property: value
list_property: ['item1', 'item2']
date_property: YYYY-MM-DD
linked_property: '[[笔记名称]]'
---
[原始内容]
```

## 属性指南

### 命名约定

- 使用小写字母和下划线: `date_created`、`action_items`
- 与现有的仓库模式保持一致
- 优先使用清晰而非巧妙的名称

### 值类型

- **文本**: 简单字符串,链接使用引号
- **列表**: 多个值的数组
- **日期**: ISO 格式 (YYYY-MM-DD)
- **数字**: 用于计数、评级、优先级
- **复选框**: 用于布尔状态

### 质量检查

- ✅ 有效的 YAML 语法
- ✅ 没有重复的属性
- ✅ 适当的属性类型
- ✅ 引用内部链接
- ✅ 有意义的值(不为空)

## 特殊情况

### 无标题笔记

从以下内容生成标题:

1. 第一个标题(如果存在)
2. 第一段摘要
3. 讨论的主要主题/概念

### 批量处理

处理文件夹时:

- 在相似笔记之间保持一致性
- 对相同概念使用相同的属性名称
- 报告所做的更改摘要

### 现有属性

- 保留有效的现有属性
- 更新已弃用的格式
- 仔细合并新属性
- 没有理由绝不删除

## 示例

### 之前:

```markdown
和团队进行了关于 Q1 计划的愉快会议...
```

### 之后:

```markdown
---
title: Q1 计划团队会议
date: 2025-09-02
type: meeting
attendees: ['团队']
project: Q1 计划
tags: [meeting, planning, q1-2025]
status: complete
---

和团队进行了关于 Q1 计划的愉快会议...
```

记住: 属性应该增强组织,而不是造成混乱。只添加对查找和连接笔记有价值的内容。
