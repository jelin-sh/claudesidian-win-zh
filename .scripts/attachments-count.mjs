#!/usr/bin/env node
/**
 * 统计未处理的附件数量
 */

import fs from 'node:fs';

const attachmentsDir = '05_Attachments';

try {
  if (!fs.existsSync(attachmentsDir)) {
    console.log('0');
    process.exit(0);
  }

  const files = fs.readdirSync(attachmentsDir);
  const unorganized = files.filter(file => file !== 'Organized');
  console.log(unorganized.length);
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
