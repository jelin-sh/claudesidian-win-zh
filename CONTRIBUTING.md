# 为 Claudesidian 做贡献

感谢你对贡献 claudesidian 的兴趣!本文档提供了为项目做贡献的指南。

## 开发设置

1. Fork 仓库
2. 克隆你的 fork: `git clone https://github.com/yourusername/claudesidian.git`
3. 安装依赖: `pnpm install`
4. 创建功能分支: `git checkout -b feature/your-feature-name`

## 提交消息约定

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 以保持清晰的提交历史:

- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 文档更改
- `style:` 代码风格更改(格式化等)
- `refactor:` 代码重构
- `test:` 测试添加或更改
- `chore:` 维护任务

示例:

```
feat: add new research-assistant command
fix: correct attachment link updates in scripts
docs: update README with MCP setup instructions
```

## 版本控制

我们使用 [语义版本控制](https://semver.org/):

- MAJOR (1.0.0): 破坏性更改
- MINOR (0.1.0): 新功能(向后兼容)
- PATCH (0.0.1): 错误修复(向后兼容)

## Pull Request 流程

1. 更新 CHANGELOG.md,在"Unreleased"下添加你的更改
2. 如需要,更新文档
3. 确保所有脚本仍然正常工作
4. 提交 PR,清晰描述更改内容

## 变更日志更新

贡献时,将你的更改添加到 CHANGELOG.md 的"Unreleased"部分:

```markdown
## [Unreleased]

### Added

- Your new feature here

### Fixed

- Your bug fix here
```

使用这些类别:

- **Added** - 新功能
- **Changed** - 对现有功能的更改
- **Deprecated** - 即将删除的功能
- **Removed** - 已删除的功能
- **Fixed** - 错误修复
- **Security** - 安全更新

## 发布流程(维护者)

1. 更新 package.json 中的版本
2. 将"Unreleased"项目移动到 CHANGELOG.md 中的新版本
3. 提交: `git commit -m "chore: release v0.2.0"`
4. 标记: `git tag v0.2.0`
5. 推送: `git push && git push --tags`
6. 从标记创建 GitHub Release,使用变更日志内容

## 代码风格

- 使用清晰、描述性的变量名
- 为复杂逻辑添加注释
- 保持函数专注和小型
- 彻底测试你的更改

## 有问题?

在进行大更改之前,请随时打开 issue 进行讨论。
