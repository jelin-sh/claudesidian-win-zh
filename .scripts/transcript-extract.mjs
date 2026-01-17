#!/usr/bin/env node
/**
 * 从音频中提取文字
 * 需要安装 yt-dlp: winget install yt-dlp
 */

import { spawn } from 'child_process';
import fs from 'fs';

const url = process.argv[2];

if (!url) {
  console.log('用法: pnpm transcript:extract <音频URL或文件路径>');
  process.exit(1);
}

// 检查 yt-dlp 是否安装
function checkYtDlp() {
  return new Promise((resolve) => {
    const ytDlp = spawn('yt-dlp', ['--version'], { shell: true });
    ytDlp.on('error', () => resolve(false));
    ytDlp.on('close', (code) => resolve(code === 0));
  });
}

// 提取文字
async function extractTranscript(url) {
  const hasYtDlp = await checkYtDlp();

  if (!hasYtDlp) {
    console.error('错误: 未找到 yt-dlp');
    console.log('请安装: winget install yt-dlp');
    process.exit(1);
  }

  console.log('正在提取文字...');

  const ytDlp = spawn('yt-dlp', [
    '--write-auto-sub',
    '--skip-download',
    '--sub-lang', 'zh-Hans,en',
    '--output', 'transcript',
    url
  ], { shell: true });

  ytDlp.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  ytDlp.on('close', (code) => {
    if (code === 0) {
      console.log('✅ 文字提取完成');
      // 查找生成的字幕文件
      const files = fs.readdirSync('.');
      const vttFiles = files.filter(f => f.endsWith('.zh-Hans.vtt') || f.endsWith('.en.vtt'));

      if (vttFiles.length > 0) {
        console.log(`生成的文件: ${vttFiles.join(', ')}`);
      }
    } else {
      console.error('❌ 提取失败');
      process.exit(1);
    }
  });
}

extractTranscript(url);
