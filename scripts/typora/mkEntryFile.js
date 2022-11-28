const fs = require("fs")
const path = require("path")
const paths = require("./paths")
const manifest = require("./manifest")
const entry = require("./templates/entry")
const cssTemplate = require("./templates/css")
const fileIcon = require("./icon/file")
const dirIcon = require("./icon/dir")
const switcherClose = require("./icon/switcherClose")
const switcherOpen = require("./icon/switcherOpen")

function manifestToTreeData() {
  const treeData = []
  manifest.forEach(({ mdPath, componentName }) => {
    const path = mdPath.replace(`${paths.appDir}/`, "").split("/")
    let i = 0
    let data = treeData
    while (i < path.length) {
      const title = path[i]
      const children = data.find((v) => v?.title === title)
      const config = {
        title,
        key: title,
        style: {
          fontSize: 14,
        },
      }
      // 文件
      if (path.length - 1 === i) {
        data.push({
          ...config,
          isLeaf: true,
          componentName,
        })
        return
      }
      // 目录
      if (!children) {
        data.push({
          ...config,
          isLeaf: false,
          selectable: false,
          children: [],
        })
      } else {
        data = children.children
        i++
      }
    }
  })
  return treeData
}

module.exports = function mkEntryFile() {
  const treeData = manifestToTreeData()
  fs.writeFileSync(
    path.resolve(paths.mdPath, "index.jsx"),
    entry({
      defaultExpandedKeys: `['${treeData[0].title}']`,
      treeData: JSON.stringify(treeData),
    }),
  )

  fs.writeFileSync(paths.cssPath, cssTemplate())
  fs.writeFileSync(paths.fileIconPath, fileIcon())
  fs.writeFileSync(paths.dirIconPath, dirIcon())
  fs.writeFileSync(paths.switcherCloseIconPath, switcherClose())
  fs.writeFileSync(paths.switcherOpenIconPath, switcherOpen())
}
