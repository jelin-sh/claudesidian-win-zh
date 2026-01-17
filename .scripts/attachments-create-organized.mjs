#!/usr/bin/env node
/**
 *创建已整理文件夹
 */

import fs from 'node:fs';

const organizedDir = '05_Attachments/Organized';

try {
  if (!fs.existsSync(organizedDir)) {
    fs.mkdirSync(organizedDir, { recursive: true });
    console.log('✅ 已创建 05_Attachments/Organized 文件夹');
  } else {
    console.log('文件夹已存在');
  }
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
