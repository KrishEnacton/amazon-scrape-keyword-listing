import { useEffect, useState } from 'react'
import './Options.css'
import { Config } from '../config'
// 'B07QXV6N1B B0725WFLMB B08GWPY8XP'

function App() {
  const [phone, setPhone] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [status, setStatus] = useState<'ideal' | 'logging' | 'scraping...' | 'error' | 'completed'>(
    'ideal',
  )
  const [userInfo, setUserInfo] = useState<any>()
  const [asin, setAsin] = useState<string>('B07QXV6N1B,B0725WFLMB,B08GWPY8XP')
  const [currentASIN, setCurrentASIN] = useState('')
  const [tabInfo, setTabInfo] = useState<any>()

  useEffect(() => {
    chrome.storage.local.get((result) => {
      const { phone, password } = result.user
      setPhone(phone)
      setPassword(password)
    })
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      switch (request.action) {
        case 'USER-INFO-TAKEN':
          chrome.storage.local.get((result) => {
            if (result.userInfo) {
              setUserInfo(result.userInfo)
              setStatus('scraping...')
              sendResponse(true)
            } else {
              setStatus('error')
              sendResponse(true)
            }
          })
          break
      }
      return true
    })
  }, [])

  useEffect(() => {
    // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //   switch (request.action) {
    //     case 'USER-INFO-TAKEN':
    //       if (tabInfo.id) chrome.tabs.remove(tabInfo.id)
    //       break
    //   }
    //   return true
    // })
    return () => {}
  }, [tabInfo])

  function formSubmit(e: any) {
    e.preventDefault()
    chrome.storage.local.set({
      user: {
        phone,
        password,
      },
    })
  }

  function startScrapping(e: any) {
    e.preventDefault()
    chrome.tabs.create({ url: Config.login_page, active: false }).then((res) => {
      setTabInfo(res)
      setStatus('logging')
    })
  }

  useEffect(() => {
    ;(async () => {
      try {
        if (status === 'scraping...') {
          chrome.tabs.remove(tabInfo.id)
          let length = asin?.split(',').length || ''.length
          let i = 0
          while (i < length) {
            let _currentASIN = asin?.split(',')[i] as string
            setCurrentASIN(_currentASIN)
            const asin_search_many = await fetch(
              'https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many/',
              {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-language': 'en-US,en;q=0.9',
                  'cache-control': 'no-cache',
                  'content-type': 'application/json',
                  token: `${userInfo.token}`,
                },
                body: `{"asins":["${_currentASIN}"],"marketplace":"US"}`,
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
              },
            ).then((res) => res.json())
            const scrapped_result = await fetch(
              `https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many_history/${asin_search_many.data}/?page=1&size=10000&qt=wm`,
              {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-language': 'en-US,en;q=0.9',
                  'cache-control': 'no-cache',
                  pragma: 'no-cache',
                  token: `${userInfo.token}`,
                },
                body: null,
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
              },
            ).then((res) => res.json())
            console.log({ [_currentASIN]: scrapped_result })
            i++
          }
          setStatus('completed')
          setCurrentASIN('')
        }
      } catch (error) {
        console.log(error)
      }
    })()
    return () => {}
  }, [status])

  return (
    <main>
      <h3>Cijiang Login</h3>
      <form action="" onSubmit={formSubmit}>
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
          Enter Comma Separated ASIN:
          <input
            type="text"
            name="asin"
            id="asin"
            required
            value={asin}
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
