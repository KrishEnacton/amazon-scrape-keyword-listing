import { Config } from '../config'
import { detectURLChange } from '../utils'

detectURLChange(main, 2000)

function main() {
  if (window.location.href.startsWith('https://cijiang.net/user/login')) {
    chrome.storage.local.get((result) => {
      const { phone, password } = result.user
      callback()
      const observer = new MutationObserver(callback)
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      })

      // Callback function to execute when mutations are observed
      function callback() {
        const OnInputEvent = new Event('input')
        if (
          document.querySelector(Config.selectors.phone_number_field) &&
          document.querySelector(Config.selectors.password_field)
        ) {
          // @ts-ignore
          document.querySelector(Config.selectors.phone_number_field).value = phone
          document.querySelector(Config.selectors.phone_number_field)?.dispatchEvent(OnInputEvent)
          // @ts-ignore
          document.querySelector(Config.selectors.password_field).value = password
          document.querySelector(Config.selectors.password_field)?.dispatchEvent(OnInputEvent)

          setTimeout(() => {
            // @ts-ignore
            document.querySelector(Config.selectors.login_button).click()
            observer.disconnect()
          }, 500)
        }
      }
    })
  }

  if (window.location.href.startsWith('https://cijiang.net/user/dashboard')) {
    let userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      chrome.storage.local
        .set({
          userInfo,
        })
        .then(() => {
          chrome.runtime.sendMessage({ action: 'USER-INFO-TAKEN' }, () => {
            // window.close()
          })
        })
    }
  }
}

export {}
