import React, { useEffect, useState } from 'react'
import { Config } from '../../config'
import { fetchResults } from '../../utils'

const ScrapeByAsin = () => {
  const [asin, setAsin] = useState('B07QXV6N1B\nB0725WFLMB\nB08GWPY8XP')
  const [tabInfo, setTabInfo] = useState<any>(null)
  const [status, setStatus] = useState('ideal')
  const [currentASIN, setCurrentASIN] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
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
    <div className="flex flex-col items-center justify-center">
    <div className="max-w-md px-6 py-8 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Scraping By ASIN</h3>
      <form onSubmit={startScrapping}>
        <div className="mb-4">
          <label htmlFor="asin" className="block mb-2">Enter ASINs:</label>
          <textarea
            name="asin"
            id="asin"
            required
            value={asin}
            rows={5}
            onChange={(e) => setAsin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md resize-none"
          ></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Start Scraping</button>
      </form>
  
      <div className="mt-4">Scrapping Status: {status}</div>
      {currentASIN && <div>Current Scrapping ASIN: {currentASIN}</div>}
    </div>
  </div>
  
  )
}

export default ScrapeByAsin
