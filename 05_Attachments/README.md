# 📎 附件

图片、PDF 和其他非文本文件的存储。

## 目的

以下内容的集中位置:
- 图片和截图
- PDF 和文档
- 电子表格和数据文件
- 音频和视频文件
- 笔记中引用的任何二进制文件

## 组织

```
05_Attachments/
├── Organized/          # 已处理的文件,有好的名称
│   ├── Images/
│   ├── PDFs/
│   └── Data/
├── IMG_*.png          # 未处理的手机图片
├── Screenshot*.png    # 未处理的截图
├── CleanShot*.png    # 未处理的 CleanShot 文件
└── *.pdf             # 各种 PDF
```

## 命名约定

### 处理前
- `IMG_1234.png` (来自手机)
- `Screenshot 2024-03-15 at 2.30.45 PM.png`
- `CleanShot 2024-03-15 at 14.30.45.png`
- `document(1).pdf`

### 处理后
- `2024-03-15_项目架构图.png`
- `2024-03-15_会议白板.jpg`
- `API_文档_v2.pdf`
- `客户访谈记录.pdf`

## 辅助脚本

使用 `pnpm` 运行这些脚本:

### 查看状态
- `attachments:list` - 列出未处理的文件
- `attachments:count` - 统计未处理的文件
- `attachments:organized` - 统计已整理的文件
- `attachments:sizes` - 显示最大的文件
- `attachments:recent` - 过去 7 天添加的文件

### 查找问题
- `attachments:orphans` - 任何地方都未引用的文件
- `attachments:refs [filename]` - 查找对文件的引用

### 组织
- `attachments:create-organized` - 创建 Organized 文件夹

## Claude Code 工作流程

### 处理截图
```
查看 05_Attachments 中的最近截图。
基于它们的内容,建议更好的名称。
帮助我组织它们。
```

### 查找孤立文件
```
查找任何笔记中未引用的所有附件。
有应该删除的吗?
```

### 批量重命名
```
审查 Attachments 中未处理的图片。
基于内容建议描述性名称。
```

### 清理
```
在 Attachments 中查找重复图片。
查找超过 10MB 的文件。
什么可以压缩或删除?
```

## 最佳实践

### 文件大小
- 保持图片在 2MB 以下以便 Git
- 压缩大型 PDF
- 对视频使用外部存储
- 提交前优化图片

### 命名
- 包含日期: `YYYY-MM-DD`
- 描述性但简洁
- 使用下划线而不是空格
- 如相关包含版本号

### 链接
```markdown
# 嵌入图片
![[05_Attachments/Organized/diagram.png]]

# 链接 PDF
[[05_Attachments/Organized/document.pdf]]

# 带描述
![[05_Attachments/Organized/chart.png|销售图表 Q1]]
```

## 处理工作流程

1. **捕获**: 将文件保存到 `05_Attachments/`
2. **审查**: 查看内容,确定目的
3. **重命名**: 给出描述性的、带日期的名称
4. **组织**: 移动到 `Organized/` 子文件夹
5. **链接**: 更新笔记中的引用
6. **清理**: 删除孤立文件

## Claude Code 提示

### 视觉分析
```
分析 Attachments 中的图片。
它们包含什么?
建议合适的名称和组织。
```

### 批量处理
```
处理这周的所有 CleanShot 文件。
基于内容重命名。
移至 Organized。
```

### 存储审计
```
分析附件存储:
- 总大小
- 最大的文件
- 文件类型分布
- 孤立文件
```

## 提示

- **每周处理** - 不要让文件堆积
- **立即命名** - 背景淡化很快
- **有目的地链接** - 只嵌入增加价值的内容
- **积极压缩** - 存储会累积
- **自由删除** - 不是每个截图都重要

## Git 考虑

### .gitignore 建议
```
*.mp4
*.mov
*.zip
.DS_Store
files_over_10mb/
```

### 对于大文件
- 对超过 10MB 的文件使用 Git LFS
- 考虑外部存储
- 改为链接到云存储
- 保持本地但 gitignore

## 记住

附件支持你的笔记,它们不替代笔记。一个命名良好、组织良好的附件值一千个随机截图。使用 Claude Code 的视觉功能帮助高效处理和组织视觉内容。
