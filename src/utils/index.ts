var currentUrl = ''
export function detectURLChange(callback: any, interval = 1000) {
  setInterval(function () {
    if (window.location.href !== currentUrl) {
      callback()
      currentUrl = window.location.href
    }
  }, interval)
}
