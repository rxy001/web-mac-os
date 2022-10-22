const html = document.querySelector(".prefers-color-scheme")

const KEY = "color-scheme"

const DARK = "dark"

const LIGHT = "light"

export default {
  toggleDarkMode() {
    html?.classList.add(DARK)
    localStorage.setItem(KEY, DARK)
  },
  toggleLightMode() {
    html?.classList.remove(DARK)
    localStorage.setItem(KEY, LIGHT)
  },
  isDarkMode() {
    const value = localStorage.getItem(KEY)
    if (value) {
      return value === DARK
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  },
}
