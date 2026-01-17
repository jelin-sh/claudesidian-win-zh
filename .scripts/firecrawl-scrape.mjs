#!/usr/bin/env node
/**
 * Firecrawl 网页抓取脚本
 * 将单个网页的完整内容保存为 Markdown 文件
 *
 * 用法: node .scripts/firecrawl-scrape.mjs <URL> <输出文件路径>
 * 示例: node .scripts/firecrawl-scrape.mjs "https://example.com/article" "03_Resources/Articles/article.md"
 *
 * 需要: FIRECRAWL_API_KEY 环境变量
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const outputPath = process.argv[3];

async function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.apiKey}`,
        'Content-Type': 'application/json',
      }
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
      url: url,
      formats: ['markdown'],
      onlyMainContent: true
    }
  };

  try {
    const response = await makeRequest('https://api.firecrawl.dev/v1/scrape', data);

    if (response.data && response.data.markdown) {
      return response.data.markdown;
    } else {
      throw new Error('响应中没有 markdown 内容');
    }
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

async function main() {
  if (!url || !outputPath) {
    console.error('用法: node .scripts/firecrawl-scrape.mjs <URL> <输出文件路径>');
    console.error('');
    console.error('示例:');
    console.error('  node .scripts/firecrawl-scrape.mjs "https://example.com/article" "03_Resources/Articles/article.md"');
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

  try {
    console.log(`🔥 正在抓取: ${url}`);

    const markdown = await scrapeWebPage(url, apiKey);

    // 确保输出目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`✅ 已保存: ${outputPath}`);
    console.log(`   (${markdown.length} 字符)`);

  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
}

main();
