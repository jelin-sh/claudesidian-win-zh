# 脚本目录

用于仓库自动化和网络内容捕获的辅助脚本。

## 可用脚本

### 附件管理

主要通过 package.json 中的 npm/pnpm 命令调用:

- `update-attachment-links.js` - 移动附件后更新笔记链接
- `fix-renamed-links.js` - 重命名文件后修复链接

### 网络内容捕获

**注意**: 这些脚本需要 Firecrawl API 密钥才能运行:

#### firecrawl-scrape.mjs (跨平台)

抓取单个 URL 并保存为 markdown 文件。

```bash
# 需要 FIRECRAWL_API_KEY 环境变量
pnpm firecrawl:scrape <url> <output_file>

# 或直接使用 node
node .scripts/firecrawl-scrape.mjs "https://example.com/article" "03_Resources/Articles/article.md"
```

**示例**:
```bash
# 保存单篇文章
pnpm firecrawl:scrape "https://example.com/article" "03_Resources/Articles/article.md"
```

#### firecrawl-batch.mjs (跨平台)

从文本文件读取多个 URL,批量抓取所有网页内容。

```bash
# 需要 FIRECRAWL_API_KEY 环境变量
pnpm firecrawl:batch <url_list_file> <output_directory>

# 或直接使用 node
node .scripts/firecrawl-batch.mjs urls.txt "03_Resources/Research"
```

**URL 列表文件格式**: 每行一个 URL,支持 # 注释

**示例**:
```bash
# 创建 urls.txt (每行一个 URL)
echo "https://example.com/article1" > urls.txt
echo "https://example.com/article2" >> urls.txt

# 批量抓取
pnpm firecrawl:batch urls.txt "03_Resources/Research"
```

### 转录提取

#### transcript-extract.mjs (跨平台)

从 YouTube 视频中提取转录文本。

```bash
# 需要 yt-dlp 工具
pnpm transcript:extract <youtube-url>
```

## NPM 脚本

在仓库根目录使用 `pnpm` 运行:

| 命令                          | 描述                       |
| ----------------------------- | -------------------------- |
| `attachments:list`            | 显示前 20 个未处理的附件   |
| `attachments:count`           | 统计未处理的附件           |
| `attachments:organized`       | 统计 Organized 文件夹中的文件 |
| `attachments:unprocessed`     | 同 count                   |
| `attachments:refs <file>`     | 查找对特定文件的引用       |
| `attachments:sizes`           | 显示 20 个最大的附件文件   |
| `attachments:orphans`         | 查找未被引用的附件         |
| `attachments:recent`          | 显示最近 7 天添加的文件    |
| `attachments:create-organized` | 创建 Organized 子文件夹    |

## 设置要求

### 网络抓取 (Firecrawl)

1. 从 [firecrawl.dev](https://firecrawl.dev) 获取 Firecrawl API 密钥
2. 在 Windows 中设置环境变量:
   ```cmd
   # CMD
   setx FIRECRAWL_API_KEY "fc-your-key-here"

   # PowerShell
   [System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", "fc-your-key-here", "User")
   ```
3. 重启终端或 Claude Code

### 转录提取

- 需要安装 `yt-dlp`:
  ```cmd
  # 使用 winget 安装
  winget install yt-dlp.ffmpeg

  # 或从 https://github.com/yt-dlp/yt-dlp/releases 下载
  ```

### 语音识别 (可选)

如需语音识别功能,可以安装 Whisper:
```cmd
winget install python
pip install openai-whisper
```

## 添加自定义脚本

1. 在 `.scripts/` 中创建脚本
2. 设置可执行权限: `chmod +x .scripts/your-script.sh`
3. 如需要,在 `package.json` 中添加 npm 脚本
4. 在此记录

## 注意事项

- 脚本假设为类 Unix 环境(macOS/Linux)
- Windows 用户可能需要 WSL 或 Git Bash
- 所有路径相对于仓库根目录
- 查看脚本注释了解其他要求
