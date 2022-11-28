const { PREFIX } = require("../constants")

module.exports = function switcherClose() {
  return `
  export default function SwitcherClose() {
    return (
      <svg
        className="${PREFIX}-switcher-icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
      >
        <path
          d="M288.791335 65.582671l446.41733 446.417329-446.41733 446.417329z"
        />
      </svg>
    )
  }`
}
