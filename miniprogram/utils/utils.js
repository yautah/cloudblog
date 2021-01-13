export function delay(milSec) {
  return new Promise((resolve) => {
    setTimeout(resolve, milSec)
  })
}

export function debounce(fn, delay) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}
