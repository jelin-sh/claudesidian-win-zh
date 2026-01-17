#!/usr/bin/env node
/**
 * 仓库统计脚本
 * 显示 Obsidian 仓库的基本统计信息
 */

import fs from 'fs';
import path from 'path';

function countMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      count += countMarkdownFiles(filePath);
    } else if (file.name.endsWith('.md')) {
      count++;
    }
  }

  return count;
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      count += countFiles(filePath);
    } else {
      count++;
    }
  }

  return count;
}

function getRecentFiles(dir, days = 7, limit = 5) {
  if (!fs.existsSync(dir)) return [];

  const cutoffMs = days * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const recentFiles = [];

  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(currentDir, file.name);
      if (file.isDirectory()) {
        scanDir(filePath);
      } else if (file.name.endsWith('.md')) {
        const stat = fs.statSync(filePath);
        if (now - stat.mtime.getTime() < cutoffMs) {
          recentFiles.push({ name: file.name, mtime: stat.mtime });
        }
      }
    }
  }

  scanDir(dir);
  recentFiles.sort((a, b) => b.mtime - a.mtime);
  return recentFiles.slice(0, limit);
}

function formatDate(date) {
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

console.log('=== 仓库统计 ===');
console.log('');

console.log('📝 笔记数量:');
console.log(`  收件箱:     ${countMarkdownFiles('00_Inbox')}`);
console.log(`  项目:       ${countMarkdownFiles('01_Projects')}`);
console.log(`  领域:       ${countMarkdownFiles('02_Areas')}`);
console.log(`  资源:       ${countMarkdownFiles('03_Resources')}`);
console.log(`  归档:       ${countMarkdownFiles('04_Archive')}`);
console.log('');

console.log('📎 附件:');
console.log(`  总计:       ${countFiles('05_Attachments')}`);
console.log(`  已整理:     ${countFiles('05_Attachments/Organized')}`);
console.log('');

console.log(`📊 总笔记数: ${countMarkdownFiles('.')}`);
console.log('');

console.log('🔄 最近活动 (7 天内):');
const recentFiles = getRecentFiles('.', 7, 5);
if (recentFiles.length === 0) {
  console.log('  没有最近修改的文件');
} else {
  recentFiles.forEach(({ name, mtime }) => {
    console.log(`  - ${name} (${formatDate(mtime)})`);
  });
}
