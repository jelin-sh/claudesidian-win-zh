---
allowed-tools: [Read, Write, Bash]
description: 安装 claudesidian shell 命令,以便从任何位置启动 Claude Code
argument-hint: (可选 shell: bash/zsh/fish)
---

# 安装 Claudesidian 命令

创建一个 shell 别名/函数,允许您从任何位置运行 `claudesidian` 来在 Claude Code 中打开您的 vault。

## 任务

安装一个 shell 命令,它能够:

1. 切换到您的 claudesidian vault 目录
2. 启动 Claude Code
3. 在终端的任何目录中工作

类似于为您的 vault 设置一个快速启动器。

## 流程

### 1. **检测当前设置**

- 检查用户正在使用的 shell (bash/zsh/fish)
- 查找当前工作目录(vault 路径)
- 确定适当的配置文件

### 2. **创建命令**

该命令将是一个别名,它能够:

- 切换到 vault 目录:`cd /path/to/your/vault`
- 尝试恢复现有会话:`claude --resume 2>/dev/null`
- 如果没有现有会话则回退到新会话:`|| claude`
- 所有操作在一个命令中完成,路径正确转义:
  `(cd "/path/to/vault" && (claude --resume 2>/dev/null || claude))`

**重要:**路径必须正确转义以处理空格和特殊字符。

这会自动进入恢复模式(如果存在现有会话),否则启动新会话。

### 3. **安装到 Shell 配置**

将别名添加到相应的配置文件:

- **Bash**: `~/.bashrc` 或 `~/.bash_profile`
- **Zsh**: `~/.zshrc`
- **Fish**: `~/.config/fish/config.fish`

### 4. **验证安装**

- 显示添加的行
- 提醒用户重新加载 shell 或 source 配置文件
- 提供测试命令

## Shell 检测

检测用户的默认 shell,支持命令行覆盖:

```bash
# 检查是否在参数中指定了 shell (/install-claudesidian-command zsh)
if [ -n "$1" ]; then
  # 用户提供 shell 类型作为参数
  SHELL_TYPE="$1"
else
  # 从 $SHELL 自动检测(用户的默认 shell,不是当前 shell)
  SHELL_TYPE=$(basename "$SHELL")
fi

# 验证 shell 类型并设置相应的配置文件
case "$SHELL_TYPE" in
  zsh)
    CONFIG_FILE="$HOME/.zshrc"
    ;;
  bash)
    # Linux 优先使用 .bashrc,macOS 优先使用 .bash_profile
    if [ -f "$HOME/.bashrc" ]; then
      CONFIG_FILE="$HOME/.bashrc"
    else
      CONFIG_FILE="$HOME/.bash_profile"
    fi
    ;;
  fish)
    CONFIG_FILE="$HOME/.config/fish/config.fish"
    ;;
  *)
    echo "❌ 不支持的 shell: $SHELL_TYPE"
    echo "   支持的 shell: bash, zsh, fish"
    echo "   用法: /install-claudesidian-command [bash|zsh|fish]"
    exit 1
    ;;
esac

echo "🐚 正在为以下 shell 安装: $SHELL_TYPE"
echo "📝 配置文件: $CONFIG_FILE"
```

**关键改进:**

- 使用 `$SHELL` 检测默认 shell(而不是检测当前会话的 `$ZSH_VERSION`/`$BASH_VERSION`)
- 支持命令行参数以覆盖自动检测
- 显示检测到的 shell 和配置文件以提高透明度
- 验证 shell 类型并为不支持的 shell 提供清晰的错误消息

## 安装步骤

1. **检测 shell**: 如果提供了参数则使用参数,否则从 `$SHELL` 自动检测
2. **获取 vault 路径**: 使用 `pwd` 获取当前目录
3. **转义路径**: 为 shell 安全正确转义引号和特殊字符
   ```bash
   # 转义路径中的任何双引号
   ESCAPED_PATH="${VAULT_PATH//\"/\\\"}"
   # 也转义反斜杠
   ESCAPED_PATH="${ESCAPED_PATH//\\/\\\\}"
   ```
4. **检查是否已安装**: 在配置文件中搜索现有的 `claudesidian` 别名/函数
   ```bash
   # 检查现有的别名/函数
   if grep -q "alias claudesidian\|function claudesidian" "$CONFIG_FILE"; then
     echo "⚠️  发现现有的 claudesidian 命令:"
     grep -A 3 "claudesidian" "$CONFIG_FILE"
     echo ""
     read -p "是否替换? (yes/no): " replace_answer
     if [[ ! "$replace_answer" =~ ^[Yy] ]]; then
       echo "安装已取消。保留现有命令。"
       exit 0
     fi
     # 标记为替换(将在添加新命令之前删除)
     REPLACING=true
   fi
   ```
5. **获取用户确认**: 显示将要添加的内容并获得最终确认
6. **创建备份**: 仅在进行修改时
   ```bash
   # 创建带时间戳的备份
   BACKUP_FILE="$CONFIG_FILE.backup-$(date +%Y%m%d-%H%M%S)"
   cp "$CONFIG_FILE" "$BACKUP_FILE"
   echo "💾 已创建备份: $BACKUP_FILE"
   ```
7. **构建安全的别名/函数命令**: 使用步骤 3 中转义的路径
   ```bash
   # 关键: 在命令中使用 $ESCAPED_PATH(而不是原始的 $VAULT_PATH)
   if [ "$SHELL_TYPE" = "fish" ]; then
     # Fish 使用函数语法,而不是别名
     COMMAND_TEXT="function claudesidian
    cd \"$ESCAPED_PATH\" && (claude --resume 2>/dev/null; or claude)
    cd -
   end"
   else
     # Bash/Zsh 使用别名语法
     # 重要: 在 $ESCAPED_PATH 周围使用双引号以保留转义
     COMMAND_TEXT="alias claudesidian='(cd \"$ESCAPED_PATH\" && (claude --resume 2>/dev/null || claude))'"
   fi
   ```
8. **如果替换则删除旧命令**:
   ```bash
   if [ "$REPLACING" = true ]; then
     # 在添加新命令之前删除旧的别名/函数
     sed -i.tmp '/alias claudesidian\|function claudesidian/,/^end$/d' "$CONFIG_FILE"
     rm -f "$CONFIG_FILE.tmp"
   fi
   ```
9. **将命令添加到配置文件**: 使用转义后的命令文本追加
   ```bash
   echo "$COMMAND_TEXT" >> "$CONFIG_FILE"
   ```
10. **显示成功消息**: 附带重新加载 shell 的说明

## 示例输出

**Bash/Zsh 示例(路径中包含空格以演示转义):**

```
🔧 正在安装 claudesidian 命令...

📁 Vault 路径: /home/user/My Obsidian Vault
🐚 检测到的 shell: zsh
📝 配置文件: /home/user/.zshrc

💾 已创建备份: /home/user/.zshrc.backup-20250107-143025

✅ 安装完成!已添加到 /home/user/.zshrc:
   alias claudesidian='(cd "/home/user/My Obsidian Vault" && (claude --resume 2>/dev/null || claude))'

🔄 要激活命令,请运行:
   source ~/.zshrc

   或启动新的终端会话。

✨ 测试命令:在任何目录中输入 'claudesidian'!
```

**Fish Shell 示例:**

```
🔧 正在安装 claudesidian 命令...

📁 Vault 路径: /home/user/My Obsidian Vault
🐚 检测到的 shell: fish
📝 配置文件: /home/user/.config/fish/config.fish

💾 已创建备份: /home/user/.config/fish/config.fish.backup-20250107-143025

✅ 安装完成!已添加到 /home/user/.config/fish/config.fish:
   function claudesidian
    cd "/home/user/My Obsidian Vault" && (claude --resume 2>/dev/null; or claude)
    cd -
end

🔄 要激活命令,请运行:
   source ~/.config/fish/config.fish

   或启动新的终端会话。

✨ 测试命令:在任何目录中输入 'claudesidian'!
```

## 处理特殊字符

实现正确处理包含以下内容的路径:

- 空格: `/Users/noah/My Vault`
- 引号: `/Users/noah/vault's backup`
- 需要转义的特殊字符

路径使用双引号括起来,任何嵌入的引号/反斜杠都会被转义。

## Fish Shell 支持

Fish shell 使用与 Bash/Zsh 不同的语法:

**Bash/Zsh (别名):**

```bash
alias claudesidian='(cd "/path" && command)'
```

**Fish (函数):**

```fish
function claudesidian
    cd "/path" && (command; or fallback)
    cd -
end
```

主要区别:

- Fish 对复杂命令使用 `function` 关键字而不是 `alias`
- Fish 使用 `; or` 而不是 `||` 来实现回退逻辑
- Fish 使用 `cd -` 返回上一个目录(而不是子 shell)
- 多行函数定义而不是单行别名

安装会自动检测 Fish 并使用正确的语法。

## 安全考虑

此命令会修改您的 shell 配置文件(一个敏感操作)。安全措施:

- **在进行任何更改之前,您将确切地看到要添加的内容**
- **在修改之前自动创建带时间戳的备份**
- **Vault 路径被正确转义以防止注入攻击**
- **仅修改 claudesidian 命令** - 配置中的其他内容保持不变
- **在替换现有命令之前请求权限**

如果出现任何问题,从以下位置恢复:`$CONFIG_FILE.backup-YYYYMMDD-HHMMSS`

## 重要说明

- 该命令使用子 shell `()`(或 Fish 中的 `cd -`),因此它会返回到您的
  原始目录
- 自动尝试恢复现有会话,回退到新会话
- 如果别名/函数已存在,询问用户是否要替换
- 在修改配置文件之前始终显示将要添加的内容
- **始终在修改之前创建带时间戳的配置文件备份**(格式:
  `YYYYMMDD-HHMMSS`)
- 备份将无限期保留 - 用户可以根据需要手动清理旧备份
- 显示备份位置,以便用户知道需要时从哪里恢复

## 使用示例

为您的默认 shell 安装(自动检测):

```
/install-claudesidian-command
```

为特定 shell 安装(覆盖自动检测):

```
/install-claudesidian-command zsh
/install-claudesidian-command bash
/install-claudesidian-command fish
```

**何时指定 shell:**

- 您使用多个 shell 并希望为特定的一个安装
- 自动检测选择了错误的 shell
- 您正在为其他人设置

## 工作原理

**Bash/Zsh (带子 shell 的别名):**

```bash
alias claudesidian='(cd "/path/to/vault" && (claude --resume 2>/dev/null || claude))'
```

1. `(cd "/path/to/vault" && ...)` - 临时更改目录的子 shell
   (路径使用双引号以确保安全)
2. `claude --resume 2>/dev/null` - 尝试恢复现有会话,抑制错误
3. `|| claude` - 如果恢复失败(没有会话),启动新会话
4. Claude 退出后,子 shell 关闭并自动返回原始目录

**Fish (带 cd - 的函数):**

```fish
function claudesidian
    cd "/path/to/vault" && (claude --resume 2>/dev/null; or claude)
    cd -
end
```

1. `cd "/path/to/vault"` - 切换到 vault 目录(路径使用双引号以确保安全)
2. `claude --resume 2>/dev/null` - 尝试恢复现有会话,抑制错误
3. `; or claude` - 如果恢复失败(没有会话),启动新会话(Fish 语法)
4. `cd -` - Claude 退出后返回上一个目录
