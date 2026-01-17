#!/usr/bin/env node
/**
 * 检查是否有新版本的 Claudesidian
 */

import https from 'https';
import fs from 'fs';

function getLatestVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/heyitsnoah/claudesidian/main/package.json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const packageJson = JSON.parse(data);
          resolve(packageJson.version);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function getLocalVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    return packageJson.version;
  } catch (error) {
    return null;
  }
}

async function checkUpdates() {
  try {
    const [remote, local] = await Promise.all([getLatestVersion(), getLocalVersion()]);

    if (!local) {
      console.log('无法读取本地版本');
      return;
    }

    if (remote !== local) {
      console.log(`📦 有可用更新! 最新版本: ${remote} (当前版本: ${local})`);
      console.log('');
      console.log('⬇');
      console.log('/upgrade');
      console.log('⬆');
      console.log('');
      console.log('## 这将会做什么');
      console.log('');
      console.log('✅ 更新到最新版本的 Claudesidian');
      console.log('✅ 获得新功能和改进');
      console.log('✅ 保留你的仓库内容和设置');
      console.log('');
    }
  } catch (error) {
    // 静默失败,避免干扰用户体验
  }
}

checkUpdates();
