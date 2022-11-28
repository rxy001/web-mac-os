const fs = require("fs")
const path = require("path")

// 写入的文件路径
const appDir = fs.realpathSync(process.cwd())

const notesPath = path.resolve(appDir, "notes")

const mdPath = path.resolve(appDir, "src/apps/Typora/Markdown")

const cssPath = path.resolve(mdPath, "typora.css")

const fileIconPath = path.resolve(mdPath, "FileIcon.tsx")

const dirIconPath = path.resolve(mdPath, "DirIcon.tsx")

const switcherOpenIconPath = path.resolve(mdPath, "SwitcherOpen.tsx")

const switcherCloseIconPath = path.resolve(mdPath, "SwitcherClose.tsx")

module.exports = {
  appDir,
  mdPath,
  notesPath,
  cssPath,
  fileIconPath,
  dirIconPath,
  switcherOpenIconPath,
  switcherCloseIconPath,
}
