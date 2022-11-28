const { PREFIX } = require("../constants")

module.exports = function switcherOpen() {
  return `
  export default function SwitcherOpen() {
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
          d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z"
        />
      </svg>
    )
  }`
}
