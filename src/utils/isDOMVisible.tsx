export default function isDOMVisible(node: HTMLElement): boolean {
  if (!node) {
    return false
  }
  if (node instanceof HTMLElement && node.offsetParent) {
    return true
  }
  if (node instanceof HTMLElement && node.getBoundingClientRect) {
    const { width, height } = node.getBoundingClientRect()
    if (width || height) {
      return true
    }
  }
  return false
}
