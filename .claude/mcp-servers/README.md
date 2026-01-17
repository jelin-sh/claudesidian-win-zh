# MCP 服务器

Model Context Protocol 服务器扩展 Claude Code 的功能。

## Gemini Vision MCP

使用 Google 的 Gemini 模型添加强大的图像和文档分析功能。

### 功能特性

- **图像分析**: 描述、分析图像并从中提取文本
- **文档处理**: 分析 PDF 和文档
- **多图像对比**: 一次对比多张图像
- **OCR**: 从图像中提取文本
- **智能文件名建议**: 为图像生成描述性文件名

### 设置

1. **获取 Gemini API 密钥**
   - 访问: https://aistudio.google.com/apikey
   - 创建免费 API 密钥

2. **添加到环境变量**

   ```bash
   # 添加到 ~/.zshrc 或 ~/.bashrc
   export GEMINI_API_KEY='your-key-here'

   # 重新加载 shell
   source ~/.zshrc
   ```

3. **安装依赖**

   ```bash
   pnpm install
   ```

4. **测试设置**
   ```bash
   pnpm test-gemini
   ```

### 可用命令

配置完成后,Claude Code 中可使用以下命令:

- `mcp__gemini-vision__analyze_image` - 分析单张图像
- `mcp__gemini-vision__analyze_multiple` - 对比多张图像
- `mcp__gemini-vision__extract_text` - OCR 文本提取
- `mcp__gemini-vision__compare_images` - 对比两张图像
- `mcp__gemini-vision__suggest_image_filename` - 生成描述性文件名
- `mcp__gemini-vision__analyze_document` - 分析 PDF 和文档

### 使用示例

**分析截图**

```
分析位于 05_Attachments/screenshot.png 的图像
并告诉我它包含什么内容。
```

**处理多张图像**

```
对比 05_Attachments/Organized/ 中的所有图像
并识别共同主题。
```

**提取文本**

```
从位于 05_Attachments/document.pdf 的 PDF
中提取所有文本。
```

**重命名图像**

```
根据内容为 05_Attachments/ 中的所有图像
建议更好的名称。
```

### 故障排除

**"GEMINI_API_KEY not found"**

- 确保已将密钥添加到 shell 配置文件
- 重启终端和 Claude Code

**"File not found"**

- 使用绝对路径或相对于仓库根目录的路径
- 检查文件权限

**速率限制**

- 免费层: 每分钟 15 次请求
- 大量使用时可考虑升级

## 添加更多 MCP

1. 将 MCP 服务器文件放在 `.claude/mcp-servers/` 中
2. 将配置添加到 Claude 设置
3. 在此记录设置步骤
4. 添加使用示例

## 资源

- [MCP 文档](https://modelcontextprotocol.io)
- [Gemini API 文档](https://ai.google.dev)
- [Claude Code MCP 指南](https://claude.ai/docs/mcp)
