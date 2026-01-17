#!/usr/bin/env node
/**
 * 列出未处理的附件 (最多 20 个)
 */

import fs from 'node:fs';

const attachmentsDir = '05_Attachments';

try {
  if (!fs.existsSync(attachmentsDir)) {
    console.log('附件文件夹不存在');
    process.exit(0);
  }

  const files = fs.readdirSync(attachmentsDir);
  const unorganized = files.filter(file => file !== 'Organized');

  if (unorganized.length === 0) {
    console.log('没有未处理的附件');
  } else {
    const toShow = unorganized.slice(0, 20);
    toShow.forEach(file => console.log(file));
    if (unorganized.length > 20) {
      console.log(`... 还有 ${unorganized.length - 20} 个文件`);
    }
  }
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
