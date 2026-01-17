#!/usr/bin/env node
/**
 * Firecrawl 批量网页抓取脚本
 * 从文本文件中读取多个 URL,批量抓取所有网页内容
 *
 * 用法: node .scripts/firecrawl-batch.mjs <URL列表文件> <输出目录>
 * 示例: node .scripts/firecrawl-batch.mjs urls.txt "03_Resources/Research"
 *
 * URL 列表文件格式: 每行一个 URL
 *
 * 需要: FIRECRAWL_API_KEY 环境变量
 */

import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { URL } from 'node:url';

const urlListFile = process.argv[2];
const outputDir = process.argv[3];

function generateFilename(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const pathname = urlObj.pathname
      .replace(/\/$/, '')
      .replace(/\//g, '_')
      .replace(/^_/, '');

    // 从 URL 提取有意义的文件名
    let filename = hostname + pathname;
    if (!filename) filename = 'article';

    // 添加日期前缀
    const date = new Date().toISOString().split('T')[0];

    return `${date}_${filename}.md`;
  } catch {
    // 如果 URL 解析失败,使用时间戳
    return `${Date.now()}.md`;
  }
}

async function main() {
  if (!urlListFile || !outputDir) {
    console.error('用法: node .scripts/firecrawl-batch.mjs <URL列表文件> <输出目录>');
    console.error('');
    console.error('示例:');
    console.error('  node .scripts/firecrawl-batch.mjs urls.txt "03_Resources/Research"');
    console.error('');
    console.error('URL 列表文件格式: 每行一个 URL');
    console.error('');
    console.error('需要设置环境变量 FIRECRAWL_API_KEY');
    process.exit(1);
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    console.error('❌ 错误: 未设置 FIRECRAWL_API_KEY 环境变量');
    console.error('');
    console.error('获取 API 密钥:');
    console.error('1. 访问 https://www.firecrawl.dev 注册');
    console.error('2. 获取免费 300 积分');
    console.error('3. 在仪表板中找到 API 密钥');
    console.error('4. 设置环境变量:');
    console.error('   Windows: setx FIRECRAWL_API_KEY "fc-your-key-here"');
    console.error('   PowerShell: [System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", "fc-your-key-here", "User")');
    process.exit(1);
  }

  // 读取 URL 列表
  if (!fs.existsSync(urlListFile)) {
    console.error(`❌ 错误: URL 列表文件不存在: ${urlListFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(urlListFile, 'utf-8');
  const urls = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#')); // 忽略空行和注释

  if (urls.length === 0) {
    console.error('❌ 错误: URL 列表文件中没有找到有效的 URL');
    process.exit(1);
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📚 准备批量抓取 ${urls.length} 个网页`);
  console.log(`📁 输出目录: ${outputDir}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = generateFilename(url);
    const outputPath = path.join(outputDir, filename);

    console.log(`[${i + 1}/${urls.length}] 正在抓取: ${url}`);

    try {
      const markdown = await scrapeWebPage(url, apiKey);
      fs.writeFileSync(outputPath, markdown, 'utf-8');
      console.log(`✅ 已保存: ${filename}`);
      console.log(`   (${markdown.length} 字符)`);
      successCount++;
    } catch (error) {
      console.error(`❌ 失败: ${error.message}`);
      failCount++;
    }

    // 添加延迟以避免速率限制
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('');
  }

  console.log('─'.repeat(50));
  console.log('✅ 批量抓取完成!');
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   总计: ${urls.length}`);
}

async function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      headers: {
        'Authorization': `Bearer ${data.apiKey}`,
        'Content-Type': 'application/json',
      },
      hostname: urlObj.hostname,
      method: 'POST',
      path: urlObj.pathname + urlObj.search,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80)
    };

    const protocol = urlObj.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || responseData}`));
          }
        } catch (e) {
          reject(new Error(`解析响应失败: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data.body));
    req.end();
  });
}

async function scrapeWebPage(url, apiKey) {
  const data = {
    apiKey,
    body: {
      formats: ['markdown'],
      onlyMainContent: true,
      url
    }
  };

  try {
    const response = await makeRequest('https://api.firecrawl.dev/v1/scrape', data);

    if (response.data && response.data.markdown) {
      return response.data.markdown;
    } 
      throw new Error('响应中没有 markdown 内容');
    
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

main();
