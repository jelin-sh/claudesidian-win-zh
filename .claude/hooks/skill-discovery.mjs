#!/usr/bin/env node
/**
 * 技能发现钩子 - 当用户提到 "skill" 时建议相关技能
 * Exit 0 stdout → 添加为 Claude 的上下文
 * 无依赖 - 纯 Node.js
 */

import fs from 'fs';
import path from 'path';

// 读取所有 stdin
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = data.prompt || '';

    // 匹配: skill, skills (不区分大小写, 单词边界)
    const skillRegex = /\bskills?\b/i;
    if (!skillRegex.test(prompt)) {
      process.exit(0);
    }

    // 获取技能名称
    const skillsDir = path.join(process.env.CLAUDE_PROJECT_DIR || '.', '.claude', 'skills');

    if (!fs.existsSync(skillsDir)) {
      process.exit(0);
    }

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const skillDirs = entries.filter(entry => entry.isDirectory());

    if (skillDirs.length === 0) {
      process.exit(0);
    }

    let output = '';
    for (const dir of skillDirs) {
      const skillPath = path.join(skillsDir, dir.name);
      const skillFile = path.join(skillPath, 'SKILL.md');

      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        // 从 YAML 前置数据中提取描述
        const descMatch = content.match(/^description:\s*(.+)$/m);
        const desc = descMatch ? descMatch[1] : '';
        output += `${dir.name}: ${desc}\n`;
      } else {
        output += `${dir.name}\n`;
      }
    }

    if (output) {
      console.log('<skill-discovery>');
      console.log('用户提到了 "skill"。此项目中的可用技能:');
      console.log('');
      const skills = output.trim().split('\n').sort();
      console.log(skills.join('\n'));
      console.log('');
      console.log('如果与用户的请求相关,请读取 SKILL.md 文件以加载技能说明。');
      console.log('</skill-discovery>');
    }
  } catch (error) {
    // 静默失败,不阻塞用户提示
  }

  process.exit(0);
});
