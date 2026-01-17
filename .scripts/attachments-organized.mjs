#!/usr/bin/env node
/**
 * 统计已整理的附件数量
 */

import fs from 'fs';

const organizedDir = '05_Attachments/Organized';

try {
  if (!fs.existsSync(organizedDir)) {
    console.log('0');
    process.exit(0);
  }

  const files = fs.readdirSync(organizedDir);
  console.log(files.length);
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
