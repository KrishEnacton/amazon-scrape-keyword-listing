import { useEffect, useState } from 'react'
import './Options.css'
import { Config } from '../config'

function App() {
  const [phone, setPhone] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [status, setStatus] = useState<'ideal' | 'scraping' | 'error'>('ideal')
  const [userInfo, setUserInfo] = useState<any>()

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
              setStatus('scraping')
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

  function formSubmit(e: any) {
    e.preventDefault()
    chrome.storage.local.set({
      user: {
        phone,
        password,
      },
    })
  }

  function startScrapping() {
    window.open(Config.login_page, '_blank')
  }

  useEffect(() => {
    ;(async () => {
      if (status === 'scraping') {
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
            body: '{"asins":["B07QXV6N1B"],"marketplace":"US"}',
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
          },
        ).then((res) => res.json())
        console.log({ asin_search_many })

        const scrapped_result = await fetch(
          'https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many_history/?page=1&size=10000&marketplace=US&query_type=many',
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

        console.log({ scrapped_result })
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

      <div>
        <button onClick={startScrapping}>Start Scrapping</button>
      </div>

      <div>Scrapping Status: {status}</div>
    </main>
  )
}

export default App
