#!/usr/bin/env node
/**
 * 显示最近的附件 (7 天内)
 */

import fs from 'fs';
import path from 'path';

const attachmentsDir = '05_Attachments';
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      const stat = fs.statSync(filePath);
      fileList.push({ path: filePath, mtime: stat.mtime });
    }
  }

  return fileList;
}

function formatDate(date) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

try {
  if (!fs.existsSync(attachmentsDir)) {
    console.log('附件文件夹不存在');
    process.exit(0);
  }

  const allFiles = getAllFiles(attachmentsDir);
  const now = Date.now();
  const recentFiles = allFiles.filter(({ mtime }) => {
    return now - mtime.getTime() < sevenDaysMs;
  });

  if (recentFiles.length === 0) {
    console.log('过去 7 天内没有新附件');
  } else {
    recentFiles.sort((a, b) => b.mtime - a.mtime);
    recentFiles.forEach(({ path: filePath, mtime }) => {
      console.log(`${formatDate(mtime)}  ${filePath}`);
    });
  }
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
