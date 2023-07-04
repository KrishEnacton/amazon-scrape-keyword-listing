import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Config } from '../../config'
import { fetchResults, getPercent } from '../../utils'
import { arrayAtomFamily, arrayAtomObject } from '../recoil'

const ScrapeByAsin = () => {
  const [asin, setAsin] = useState('B07QXV6N1B\nB0725WFLMB\nB08GWPY8XP')
  const [tabInfo, setTabInfo] = useState<any>(null)
  const [status, setStatus] = useState('ideal')
  const [currentASIN, setCurrentASIN] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)
  const [tags, setTags] = useRecoilState(arrayAtomFamily(arrayAtomObject.ASINTags))
  const [tag, setTag] = useState<any>()

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
            let keywords: any = []
            for (const _currentASIN of asinList) {
              setCurrentASIN(_currentASIN)
              const scrapped_result = await fetchResults({ asin: _currentASIN, userInfo })
              keywords.push(scrapped_result)
              console.log({ [_currentASIN]: scrapped_result })
            }
            setStatus('completed')
            //@ts-ignore
            setTags((prev) => [...prev, { tag, keywords }])
            setCurrentASIN('')
          } catch (error) {
            console.log(error)
          }
          break
      }
    })()
  }, [status])
  useEffect(() => {
    console.log({ asin: tags })
  }, [tags])

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='max-w-md px-6 py-8 bg-white shadow-lg rounded-lg'>
        <h3 className='text-xl font-semibold mb-4'>Scraping By ASIN</h3>
        <form onSubmit={startScrapping}>
          <div className='mb-4'>
            <label htmlFor='asin' className='block mb-2'>
              Enter ASINs:
            </label>
            <textarea
              name='asin'
              id='asin'
              required
              value={asin}
              rows={5}
              onChange={(e) => setAsin(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md resize-none'
            ></textarea>
          </div>
          <div className='my-4'>
            <label htmlFor='keyword-tag' className='block mb-2'>
              Enter Tag:
            </label>
            <input
              type='text'
              name='keyword-tag'
              id='keyword-tag'
              onChange={(e) => setTag(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md resize-none'
            />
          </div>
          <div className='flex justify-center'>
            <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded-md'>
              Start Scraping
            </button>
          </div>
        </form>
        {status !== 'ideal' && (
          <>
            <div className='w-full mt-4 bg-gray-200 rounded-full h-2.5 flex gap-x-2 justify-between'>
              <div
                className='bg-blue-600 h-2.5 rounded-full'
                style={{ width: `${getPercent(currentASIN, asin.split('\n'))}%` }}
              ></div>
            </div>
            <div>{getPercent(currentASIN, asin.split('\n')).toFixed(0) + '%'}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default ScrapeByAsin