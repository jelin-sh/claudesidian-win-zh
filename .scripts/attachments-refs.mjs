#!/usr/bin/env node
/**
 * 在 Markdown 文件中搜索附件引用
 */

import fs from 'node:fs';
import path from 'node:path';

const searchTerm = process.argv[2];

if (!searchTerm) {
  console.log('用法: pnpm attachments:refs <搜索词>');
  process.exit(1);
}

function searchInMarkdownFiles(dir, searchTerm, results = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // 跳过 node_modules 和 .git
      if (file.name !== 'node_modules' && file.name !== '.git') {
        searchInMarkdownFiles(filePath, searchTerm, results);
      }
    } else if (file.name.endsWith('.md')) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const matchingLines = [];

        lines.forEach((line, index) => {
          if (line.includes(searchTerm)) {
            matchingLines.push(`${index + 1}: ${line.trim()}`);
          }
        });

        if (matchingLines.length > 0) {
          results.push({ file: filePath, matches: matchingLines });
        }
      } catch (error) {
        // 跳过无法读取的文件
      }
    }
  }

  return results;
}

try {
  const results = searchInMarkdownFiles('.', searchTerm);

  if (results.length === 0) {
    console.log(`未找到包含 "${searchTerm}" 的引用`);
  } else {
    let count = 0;
    results.slice(0, 20).forEach(({ file, matches }) => {
      console.log(`\n${file}:`);
      matches.slice(0, 5).forEach(match => {
        console.log(`  ${match}`);
        count++;
      });
    });

    if (results.length > 20) {
      console.log(`\n... 还有更多结果`);
    }
  }
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
