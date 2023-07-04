import { useEffect, useState } from 'react'
import './Options.css'
import { Config } from '../config'
import { fetchResults } from '../utils'

// Login with: 15677676824 / CNv$c8nzLkjb.

function App() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('ideal')
  const [userInfo, setUserInfo] = useState<any>(null)
  const [asin, setAsin] = useState('B07QXV6N1B\nB0725WFLMB\nB08GWPY8XP')
  const [currentASIN, setCurrentASIN] = useState('')
  const [tabInfo, setTabInfo] = useState<any>(null)

  useEffect(() => {
    chrome.storage.local.get((result) => {
      const { phone, password } = result.user
      setPhone(phone)
      setPassword(password)
    })
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.action === 'USER-INFO-TAKEN') {
        chrome.storage.local.get((result) => {
          if (result.userInfo) {
            setUserInfo(result.userInfo)
            setStatus('scraping')
            sendResponse(true)
          } else {
            setStatus('error')
            sendResponse(true)
          }
        })
      }
      return true
    })
  }, [])

  function formSubmit(e) {
    e.preventDefault()
    chrome.storage.local.set({
      user: {
        phone,
        password,
      },
    })
  }

  async function startScrapping(e) {
    e.preventDefault()
    chrome.tabs.create({ url: Config.login_page, active: false }).then((res) => {
      setTabInfo(res)
      setStatus('logging')
    })
  }

  useEffect(() => {
    ;(async () => {
      switch (status) {
        case 'scraping':
          try {
            chrome.tabs.remove(tabInfo.id)
            setStatus('scraping')
            const asinList = asin.split('\n')
            for (const _currentASIN of asinList) {
              setCurrentASIN(_currentASIN)
              const scrapped_result = await fetchResults({ asin: _currentASIN, userInfo })
              console.log({ [_currentASIN]: scrapped_result })
            }
            setStatus('completed')
            setCurrentASIN('')
          } catch (error) {
            console.log(error)
          }
          break
      }
    })()
  }, [status])

  return (
    <main>
      <h3>Sytecho Keywords System Login</h3>
      <form onSubmit={formSubmit}>
        <div>
          Phone Number:{' '}
          <input
            type="text"
            name="phone"
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          Password:{' '}
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>

      <h3>Scrapping</h3>
      <form onSubmit={startScrapping}>
        <div>
          Enter ASINs:
          <textarea
            name="asin"
            id="asin"
            required
            value={asin}
            rows={5}
            onChange={(e) => setAsin(e.target.value)}
          />
        </div>
        <button type="submit">Start Scrapping</button>
      </form>

      <div>Scrapping Status: {status}</div>
      {currentASIN && <div>Current Scrapping ASIN: {currentASIN}</div>}
    </main>
  )
}

export default App
