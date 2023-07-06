import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { fetchResults, getPercent, getToken, postbinAPI, notify } from '../../utils'
import { arrayAtomFamily, arrayAtomObject } from '../recoil'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SpinnerLoader } from '../../utils/Loaders'

const ScrapeByAsin = ({ phone, password }) => {
  const [asin, setAsin] = useState('B07QXV6N1B\nB0725WFLMB\nB08GWPY8XP')
  const [tabInfo, setTabInfo] = useState<any>(null)
  const [status, setStatus] = useState('ideal')
  const [currentASIN, setCurrentASIN] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)
  const [tags, setTags] = useRecoilState(arrayAtomFamily(arrayAtomObject.ASINTags))
  const [batch, setBatch] = useState<any>()

  async function startScrapping(e) {
    e.preventDefault()
    try {
      setStatus('logging')
      const userInfo: any = await getToken({ phone, password })
      setUserInfo({ ...userInfo, password })
      setStatus('scraping')
      console.log({ ...userInfo, password })
    } catch (error) {
      setStatus('error')
    }
  }

  useEffect(() => {
    ;(async () => {
      switch (status) {
        case 'scraping':
          try {
            setStatus('scraping')
            const asinList = asin.split('\n')
            let keywords: any = []
            for (const _currentASIN of asinList) {
              setCurrentASIN(_currentASIN)
              const scrapped_result = await fetchResults({ asin: _currentASIN, userInfo })
              const body = {
                batch_name: batch,
                ASIN: scrapped_result.asin_infos[0],
                data: scrapped_result.data,
              }
              const result = await postbinAPI(
                'https://keywords.aiamzads.com/api/keyword-store/amazon-search',
                body,
              )
              console.log({ result })
              keywords.push(scrapped_result)
              console.log({ status })
              console.log({ [_currentASIN]: scrapped_result })
            }
            setStatus('completed')
            //@ts-ignore
            setTags((prev) => [...prev, { batch, keywords }])
            notify('Scraping Done!')
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
      <div className="max-w-md px-6 py-8 bg-white shadow-lg rounded-lg w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Scraping By ASIN</h3>
        <form onSubmit={startScrapping} className="my-2">
          <div className="mb-4">
            <label htmlFor="asin" className="block mb-2">
              Enter ASINs:
            </label>
            <textarea
              name="asin"
              id="asin"
              required
              value={asin}
              rows={5}
              onChange={(e) => setAsin(e.target.value)}
              onFocus={() => setStatus('ideal')}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
            ></textarea>
          </div>
          <div className="my-4">
            <label htmlFor="keyword-batch" className="block mb-2">
              Enter Batch Name: <span className="text-red-500 text-lg">*</span>
            </label>
            <input
              type="text"
              required
              name="keyword-batch"
              id="keyword-batch"
              onFocus={() => setStatus('ideal')}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
            />
          </div>
          <div className="flex justify-center gap-x-4">
            <div className="my-2">
              <button
                type="submit"
                disabled={status == 'scraping' ? true : false}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                  status == 'scraping' ? 'px-10 py-3' : ''
                }`}
              >
                {status == 'scraping' ? <SpinnerLoader className="h-4 w-4" /> : 'Start Scraping'}
              </button>
            </div>
            {status == 'completed' && (
              <div className=" my-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  <a download={'value'}>Download CSV</a>
                </button>
              </div>
            )}
          </div>
        </form>
        {status == 'scraping' && (
          <>
            <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 flex gap-x-2 justify-between">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${getPercent(currentASIN, asin.split('\n'))}%` }}
              ></div>
            </div>
            <div>{getPercent(currentASIN, asin.split('\n')).toFixed(0) + '%'}</div>
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  )
}

export default ScrapeByAsin
