const crypto = require("crypto")

function hash(data) {
  const hash = crypto.createHash("sha256")
  return hash.update(data).digest("hex")
}

module.exports = {
  hash,
}
