#!/usr/bin/env node
/**
 * 查找大附件 (前 20 个)
 */

import fs from 'node:fs';
import path from 'node:path';

const attachmentsDir = '05_Attachments';

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push({ path: filePath, size: stat.size });
    }
  });

  return fileList;
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const size = stats.size;

  if (size < 1024) return `${size  } B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)  } KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)  } MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)  } GB`;
}

try {
  if (!fs.existsSync(attachmentsDir)) {
    console.log('附件文件夹不存在');
    process.exit(0);
  }

  const allFiles = getAllFiles(attachmentsDir);
  allFiles.sort((a, b) => b.size - a.size);

  const toShow = allFiles.slice(0, 20);
  toShow.forEach(({ path: filePath, size }) => {
    console.log(`${getFileSize(filePath).padStart(10)}  ${filePath}`);
  });
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
