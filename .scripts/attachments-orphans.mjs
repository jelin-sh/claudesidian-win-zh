#!/usr/bin/env node
/**
 * 查找未被引用的附件
 */

import fs, { readFileSync } from 'node:fs'
import path from 'node:path'

const attachmentsDir = '05_Attachments'

function getAllAttachments(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const filePath = path.join(dir, file.name)
    if (file.isDirectory()) {
      // 跳过 Organized 子文件夹
      if (file.name !== 'Organized') {
        getAllAttachments(filePath, fileList)
      }
    } else {
      fileList.push({ name: file.name, path: filePath })
    }
  }

  return fileList
}

function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const filePath = path.join(dir, file.name)
    if (file.isDirectory()) {
      // 跳过 node_modules 和 .git
      if (file.name !== 'node_modules' && file.name !== '.git') {
        getAllMarkdownFiles(filePath, fileList)
      }
    } else if (file.name.endsWith('.md')) {
      fileList.push(filePath)
    }
  }

  return fileList
}

function searchInFile(filePath, searchTerm) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return content.includes(searchTerm)
  } catch {
    return false
  }
}

try {
  if (!fs.existsSync(attachmentsDir)) {
    console.log('附件文件夹不存在')
    process.exit(0)
  }

  const markdownFiles = getAllMarkdownFiles('.')
  const attachments = getAllAttachments(attachmentsDir)

  const orphans = attachments.filter(({ name, path: _filePath }) => {
    return !markdownFiles.some((mdFile) => searchInFile(mdFile, name))
  })

  if (orphans.length === 0) {
    console.log('没有发现孤立项件')
  } else {
    orphans.forEach(({ name }) => console.log(name))
  }
} catch (error) {
  console.error('错误:', error.message)
  process.exit(1)
}
