const fs = require("fs")
const path = require("path")

// 写入的文件路径
const appDir = fs.realpathSync(process.cwd())

const notesPath = path.resolve(appDir, "notes")

const mdPath = path.resolve(appDir, "src/apps/Typora/Markdown")

const cssPath = path.resolve(mdPath, "typora.css")

const fileIconPath = path.resolve(mdPath, "FileIcon.jsx")

const dirIconPath = path.resolve(mdPath, "DirIcon.jsx")

const switcherOpenIconPath = path.resolve(mdPath, "SwitcherOpen.jsx")

const switcherCloseIconPath = path.resolve(mdPath, "SwitcherClose.jsx")

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
