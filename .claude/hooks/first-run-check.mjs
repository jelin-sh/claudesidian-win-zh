#!/usr/bin/env node
/**
 * 首次运行检查
 * 如果是第一次运行,显示欢迎信息
 */

import fs from 'node:fs';

const FIRST_RUN_FILE = 'FIRST_RUN';

if (fs.existsSync(FIRST_RUN_FILE)) {
  const message = `
# 🚀 欢迎使用 Claudesidian!

**这似乎是你第一次使用这个仓库。**

## 快速开始

运行设置向导:

⬇
/init-bootstrap
⬆

## 这将做什么:

✅ 设置你的个性化配置
✅ 断开与原始仓库的连接
✅ 帮助你导入任何现有的 Obsidian 仓库
✅ 配置你偏好的工作流程
✅ 创建你的 PARA 文件夹结构

设置向导将引导你完成所有步骤!
`;

  console.log(JSON.stringify({
    hookSpecificOutput: {
      additionalContext: message,
      hookEventName: "SessionStart"
    }
  }));
}
