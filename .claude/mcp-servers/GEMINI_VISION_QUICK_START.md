# Gemini Vision MCP 服务器 - 快速开始指南

**在 5 分钟内在新机器上让 Gemini Vision 运行起来**

## 先决条件检查

运行这些命令以验证你拥有所需的一切:

```bash
node --version  # 应该是 v22+
pnpm --version  # 应该已安装
claude --version  # Claude Code 应该已安装
```

如果缺少任何一项:

- Node.js: 从 [nodejs.org](https://nodejs.org/) 安装 (v22+)
- pnpm: `npm install -g pnpm`
- Claude Code: 从 [claude.ai/code](https://claude.ai/code) 下载

## 步骤 1: 获取你的 Gemini API 密钥

1. 访问
   [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. 点击"Create API Key"(创建 API 密钥)
3. 复制密钥(以 `AIzaSy...` 开头)

## 步骤 2: 设置环境变量

### 对于使用 Bash 的 Linux/macOS:

```bash
echo 'export GEMINI_API_KEY="your-actual-api-key-here"' >> ~/.bashrc
source ~/.bashrc
echo $GEMINI_API_KEY  # 验证是否显示你的密钥
```

### 对于使用 Zsh 的 Linux/macOS:

```bash
echo 'export GEMINI_API_KEY="your-actual-api-key-here"' >> ~/.zshrc
source ~/.zshrc
echo $GEMINI_API_KEY  # 验证是否显示你的密钥
```

### 对于 Windows PowerShell:

```powershell
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your-key-here', 'User')
# 重启 PowerShell
$env:GEMINI_API_KEY  # 验证是否显示你的密钥
```

## 步骤 3: 安装依赖

**⚠️ 关键:在添加 MCP 服务器之前必须执行此步骤!**

导航到你的 Obsidian 仓库:

```bash
cd ~/dev/02_Areas/Obsidian  # 或你的仓库所在位置
```

安装所需的依赖:

```bash
# 安装 npm 包(必需 - 先执行此操作!)
pnpm install

# 这将安装:
# - @google/generative-ai (Gemini API 客户端)
# - @modelcontextprotocol/sdk (MCP 服务器框架)
# - package.json 中的其他依赖
```

**常见错误修复**: 如果你看到
`Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@modelcontextprotocol/sdk'`,
你忘记运行 `pnpm install` 了!

**从 Obsidian 中隐藏 node_modules**(可选但推荐):

1. 打开 Obsidian
2. 进入 Settings → Files & Links → Excluded files
3. 点击"Manage"
4. 将 `node_modules/` 添加到列表
5. 可选地也可以添加: `pnpm-lock.yaml`, `.gitignore`

这在使用标准 Node.js 模块解析的同时保持你的仓库整洁。

## 步骤 4: 注册 MCP 服务器

**对于项目范围安装(推荐用于团队使用):**

```bash
# 将服务器添加到项目(创建 .mcp.json 文件)
claude mcp add --scope project gemini-vision node .claude/mcp-servers/gemini-vision.mjs
```

**对于用户范围安装(跨所有项目的个人使用):**

```bash
# 将服务器添加到你的用户配置
claude mcp add --scope user gemini-vision node .claude/mcp-servers/gemini-vision.mjs
```

添加后,你需要编辑 `.mcp.json` 文件来添加你的 API 密钥:

```json
{
  "mcpServers": {
    "gemini-vision": {
      "type": "stdio",
      "command": "node",
      "args": [".claude/mcp-servers/gemini-vision.mjs"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**重要提示**:

- 命令必须从 Obsidian 仓库根目录运行
- 你必须先运行 `pnpm install`
- `.mcp.json` 文件出于安全考虑已被 gitignore

## 步骤 5: 验证是否正常工作

1. **打开一个新的 Claude Code 窗口**(关键 - 必须是新的):

   ```bash
   cd ~/dev/Obsidian
   claude
   ```

2. **检查服务器是否已连接**: 在 Claude 中输入 `/mcp`

   你应该看到:

   ```
   gemini-vision ✔ connected
   ```

3. **使用实际命令测试**:
   ```
   Use gemini-vision to extract text from 05_Attachments/[any-image.png]
   ```

## 故障排除

### "gemini-vision failed"(失败)或未在 /mcp 中显示

1. **最常见问题 - 未安装依赖**:

   ```bash
   # 如果你看到: Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@modelcontextprotocol/sdk'
   # 运行此命令:
   pnpm install
   ```

   然后在 Claude Code 中重新连接 MCP 服务器。

2. **检查 API 密钥是否已配置**:
   - 对于项目范围:检查 `.mcp.json` 在 env 部分是否有你的 API 密钥
   - 对于用户范围:检查 `~/.claude.json` 是否有你的 API 密钥
   - 密钥格式应该是: `"GEMINI_API_KEY": "AIzaSy..."`

3. **测试服务器能否直接运行**:

   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   node .claude/mcp-servers/gemini-vision.mjs
   ```

   应该显示:"🚀 Gemini Vision MCP Server running"按 Ctrl+C 退出。

4. **重新添加服务器(对于项目范围)**:

   ```bash
   claude mcp remove gemini-vision --scope project
   claude mcp add --scope project gemini-vision node .claude/mcp-servers/gemini-vision.mjs
   # 然后编辑 .mcp.json 添加你的 API 密钥
   ```

5. **检查日志**:

   ```bash
   # 查找日志目录
   ls ~/Library/Caches/claude-cli-nodejs/*/mcp-logs-gemini-vision/
   # 或在 Linux 上:
   ls ~/.cache/claude-cli-nodejs/*/mcp-logs-gemini-vision/

   # 查看最新日志
   tail -f [log-directory]/*.txt
   ```

### "Cannot find module"(找不到模块)错误

1. **验证 package.json 是否存在**:

   ```bash
   cat package.json
   ```

   应该显示 @google/generative-ai 和 @modelcontextprotocol/sdk

2. **重新安装依赖**:

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **检查 node_modules 是否已创建**:
   ```bash
   ls node_modules/@google/generative-ai
   ```

### 服务器运行但工具不工作

1. **直接测试 API 密钥**:

   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
   ```

   应该返回模型列表,而不是错误。

2. **检查文件路径**:
   - 使用从仓库根目录开始的绝对路径
   - 示例: `05_Attachments/image.png` 而不是 `./05_Attachments/image.png`

## 可用工具

正常运行后,你可以在 Claude 中使用这些工具:

### 图像分析

```
# 分析图像
Use gemini-vision to analyze 05_Attachments/screenshot.png

# 提取文本(OCR)
Use gemini-vision to extract text from 05_Attachments/document.jpg

# 对比图像
Use gemini-vision to compare image1.png and image2.png

# 建议文件名
Use gemini-vision to suggest a filename for IMG_1234.jpg

# 分析多张图像
Use gemini-vision to analyze multiple: image1.png, image2.png, image3.png
```

### 视频分析(新功能!)

```
# 分析本地视频文件
Use gemini-vision to analyze video 05_Attachments/video.mp4

# 分析 YouTube 视频
Use gemini-vision to analyze YouTube video https://www.youtube.com/watch?v=VIDEO_ID

# 自定义视频分析提示
Use gemini-vision to analyze video file.mp4 and extract all visible text
```

**注意:** 视频处理可能需要 30-60 秒,因为文件在分析前需要达到 ACTIVE
状态。服务器将自动等待并显示进度更新。

### 支持的格式

**图像:** JPG, JPEG, PNG, GIF, BMP, WebP **视频:** MP4, AVI, MOV, WebM, MKV,
WMV, FLV, 3GP, M4V **文档:** PDF, TXT, DOC, DOCX, ODT, RTF **特殊:**
YouTube URL(直接支持,无需下载)

## 快速重新安装(如果已设置过一次)

如果你已经在 shell 配置文件中设置了 API 密钥:

```bash
cd ~/dev/Obsidian
git pull
pnpm install
claude mcp add gemini-vision \
  --scope local \
  --env GEMINI_API_KEY=$GEMINI_API_KEY \
  -- node .claude/mcp-servers/gemini-vision.mjs
```

然后打开一个新的 Claude 窗口并测试。

## 文件位置

- **服务器代码**: `.claude/mcp-servers/gemini-vision.mjs`
- **依赖**: `package.json`
- **本指南**: `.claude/mcp-servers/GEMINI_VISION_QUICK_START.md`

## 需要帮助?

1. 检查上面的故障排除部分
2. 验证所有先决条件是否已安装
3. 确保你在 Obsidian 仓库根目录中
4. 确保 API 密钥已在环境中正确设置

---

_最后测试时间: 2025 年 9 月_
