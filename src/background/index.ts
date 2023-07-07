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

export {}
