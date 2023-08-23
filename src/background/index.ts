let OptionsUrl = `chrome-extension://${chrome.runtime.id}/options.html`

chrome.action.onClicked.addListener(() => {
  tabChange()
})

const tabChange = () => {
  chrome.tabs.query({}, (tabs) => {
    if (!tabs.find((tab) => tab.url === OptionsUrl)) {
      chrome.tabs.create({
        url: OptionsUrl,
      })
    } else {
      chrome.tabs.query({ url: OptionsUrl }, (tabs: any) => {
        chrome.tabs.update(tabs[0].id, { active: true })
      })
    }
  })
}

async function removeCookie() {
  const cookies = await chrome.cookies.getAll({ url: 'https://keywords.aiamzads.com/' })

  for (const cookie of cookies) {
    await chrome.cookies.remove({
      url: 'https://keywords.aiamzads.com/',
      name: cookie.name,
    })
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'REMOVE_COOKIES') {
    removeCookie()
    sendResponse(true)
  }

  if (request.action === 'GET_COOKIES') {
    chrome.cookies.getAll({ url: 'https://keywords.aiamzads.com/' }).then((res) => {
      sendResponse({ cookies: res ?? {} })
    })
  }
  return true
})

export {}
