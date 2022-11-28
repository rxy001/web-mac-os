const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const componentTemplate = require("./templates/markdown")
const paths = require("./paths")
const manifest = require("./manifest")
const mkEntryFile = require("./mkEntryFile")
const utils = require("./utils")
const cssTemplate = require("./templates/css")
const fileIcon = require("./icon/file")
const dirIcon = require("./icon/dir")
const switcherClose = require("./icon/switcherClose")
const switcherOpen = require("./icon/switcherOpen")

const mkMdDirImpl = mkMdDir()

main()

function cloneNotesRepo() {
  // eslint-disable-next-line no-console
  console.clear()
  removeNotesRepo()
  execSync("git clone https://github.com/rxy001/notes.git", {
    stdio: [0, 1, 2],
    cwd: paths.appDir,
  })
}

function removeNotesRepo() {
  try {
    fs.rmdirSync(paths.notesPath, {
      force: true,
      recursive: true,
    })
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function mkMdDir() {
  let has = false
  return () => {
    if (!has) {
      try {
        fs.rmdirSync(paths.mdPath, {
          force: true,
          recursive: true,
        })
        // eslint-disable-next-line no-empty
      } catch (error) {}
      fs.mkdirSync(paths.mdPath)
      has = true
    }
  }
}

function mkMdFile(dirent, direntPath) {
  const file = fs.readFileSync(direntPath, {
    encoding: "utf8",
  })
  const contentHash = utils.hash(file)
  const componentName = `MD_${contentHash.slice(0, 8)}`
  const componentPath = path.resolve(paths.mdPath, `${componentName}.tsx`)

  fs.writeFileSync(componentPath, componentTemplate(file))
  manifest.push({
    componentName,
    componentPath,
    contentHash,
    mdName: dirent.name,
    mdPath: direntPath,
  })
}

function recursivelyTraverseNotes(dirPath) {
  const dirent = fs.readdirSync(dirPath, {
    withFileTypes: true,
  })
  const filteredDirent = dirent.filter(
    ({ name }) => name !== ".git" && name !== "README.md",
  )
  filteredDirent.forEach((dirent) => {
    const direntPath = path.resolve(dirPath, dirent.name)
    if (dirent.isDirectory()) {
      recursivelyTraverseNotes(direntPath)
    } else if (dirent.isFile()) {
      mkMdDirImpl()
      mkMdFile(dirent, direntPath)
    }
  })
}

function mkAdditionalFiles() {
  fs.writeFileSync(paths.cssPath, cssTemplate())
  fs.writeFileSync(paths.fileIconPath, fileIcon())
  fs.writeFileSync(paths.dirIconPath, dirIcon())
  fs.writeFileSync(paths.switcherCloseIconPath, switcherClose())
  fs.writeFileSync(paths.switcherOpenIconPath, switcherOpen())
}

function main() {
  cloneNotesRepo()
  recursivelyTraverseNotes(paths.notesPath)
  mkEntryFile()
  mkAdditionalFiles()
  removeNotesRepo()
}
