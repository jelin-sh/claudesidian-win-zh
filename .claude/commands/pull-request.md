# Pull Request 命令

创建新功能分支、提交更改、推送到 GitHub 并打开 pull request - 所有操作在一个命令中完成。非常适合贡献功能或修复。

## 任务

自动化整个 pull request 工作流程:创建分支、暂存更改、使用描述性消息提交、推送到 GitHub 并使用正确的描述打开 PR。

## 流程

### 1. **检查先决条件**

- 确保 git 仓库存在
- 检查要包含的未提交更改
- 验证 GitHub CLI (`gh`) 是否可用
- 获取当前分支作为基础分支
- 如果已经在功能分支上,询问:"从当前分支创建 PR?"

### 2. **创建功能分支**

```bash
# 从 PR 标题生成分支名称或使用提供的名称
# 清理分支名称:小写、用连字符替换空格、移除特殊字符
branch_name=$(echo "$branch_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g')

# 检查分支是否已存在
if git show-ref --verify --quiet refs/heads/$branch_name; then
  echo "Branch $branch_name already exists, using alternative name"
  branch_name="${branch_name}-$(date +%s)"
fi

# 格式: feature/short-description 或 fix/issue-name
git checkout -b $branch_name
```

### 3. **暂存和审查更改**

- 向用户显示 `git status`
- 显示 `git diff --staged` 以供审查
- 如果没有暂存的更改,则暂存所有更改: `git add -A`
- 在继续之前与用户确认更改

### 4. **提交更改**

- 分析更改以创建有意义的提交消息
- 使用 conventional commits 格式 (feat:、fix:、docs: 等)
- 如果更改复杂,包含详细的提交正文

```bash
git commit -m "feat: add new feature

- Detail 1
- Detail 2

🤖 Generated with Claude Code"
```

### 5. **推送到 GitHub**

```bash
# 使用上游跟踪推送
git push -u origin feature/[branch-name]
```

### 6. **创建 Pull Request**

使用 `gh pr create`,包含:

- 描述性标题
- 详细正文,包括:
  - 更改摘要
  - 测试清单
  - 相关问题(如果有)
- 设置基础分支(通常是 main/master)

```bash
gh pr create \
  --title "Feature: Add awesome new capability" \
  --body "$(cat <<'EOF'
## Summary
Brief description of what this PR does

## Changes
- Added feature X
- Fixed bug Y
- Improved performance of Z

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Documentation updated

## Screenshots
(if applicable)

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)" \
  --base main
```

### 7. **提供后续步骤**

- 显示 PR URL
- 提醒审查流程
- 建议后续操作(请求审查、添加标签等)

## 参数

- **可选**: 分支名称(如果未提供,则从更改自动生成)
- **可选**: PR 标题(如果未提供,则从更改分析)
- **可选**: 目标分支(默认为 main/master)

## 使用示例

```bash
# 从更改自动生成分支和 PR
/pull-request

# 指定分支名称
/pull-request feature/add-auth

# 完整指定
/pull-request fix/bug-123 "Fix: Resolve authentication timeout issue" develop
```

## 输出示例

```
📝 正在分析更改...
🌿 创建分支: feature/add-download-command
✅ 已提交: feat: add download-attachment command
📤 已推送到 origin
🔗 Pull Request 已创建: https://github.com/user/repo/pull/42

后续步骤:
- 请求团队成员审查
- 添加相关标签
- 链接相关问题
```

## 分支命名约定

- **功能**: `feature/description`
- **修复**: `fix/issue-or-description`
- **文档**: `docs/what-updated`
- **重构**: `refactor/what-changed`
- **性能**: `perf/optimization`
- **测试**: `test/what-tested`

## 提交消息格式

遵循 conventional commits:

- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 仅文档
- `style:` 格式化、缺少分号等
- `refactor:` 既不修复错误也不添加功能的代码更改
- `perf:` 性能改进
- `test:` 添加缺失的测试
- `chore:` 对构建过程或辅助工具的更改

## 安全功能

- 如果更改很大,推送前确认
- 提交前显示差异
- 创建前验证 PR 描述
- 检查分支的 PR 是否已存在
- 优雅地处理合并冲突

## 错误处理

- 如果没有更改:"没有创建 PR 的更改"
- 如果已经在功能分支上:询问是否应该从当前分支创建 PR
- 如果 PR 存在:显示现有 PR URL
- 如果推送失败:检查权限和远程设置
