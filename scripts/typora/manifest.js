// const fs = require("fs")
// const paths = require("./paths")

class Manifest {
  constructor() {
    // this.data = this.readLocal() ?? [];
    this.data = []
  }

  // readLocal() {
  //   const data = fs.readFileSync(paths.manifestPath, {
  //     encoding: "utf8",
  //   });

  //   if (data) {
  //     return JSON.parse(data);
  //   }
  // }

  // writeLocal() {
  //   fs.writeFileSync(paths.manifestPath, JSON.stringify(this.data));
  // }

  push(info) {
    this.data.push({
      componentName: info.componentName,
      componentPath: info.componentPath,
      mdName: info.mdName,
      mdPath: info.mdPath,
      contentHash: info.contentHash,
    })
  }

  // findIndex(cb) {
  //   return this.data.findIndex(cb);
  // }

  forEach(cb) {
    this.data.forEach(cb)
  }
}

module.exports = new Manifest()
