import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { fetchResultsFromKeyword, getPercent } from '../../utils'
import { arrayAtomFamily, arrayAtomObject } from '../recoil'

const ScrapeByKeyword: React.FC<{}> = ({}) => {
  const [keyword, setKeyword] = useState<string>('')
  const [status, setStatus] = useState('ideal')
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [tags, setTags] = useRecoilState(arrayAtomFamily(arrayAtomObject.keywordTags))
  const [tag, setTag] = useState<any>()
  // const [userInfo, setUserInfo] = useState<any>(null)

  // useEffect(() => {
  //     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //         if (request.action === 'USER-INFO-TAKEN') {
  //             chrome.storage.local.get((result) => {
  //                 if (result.userInfo) {
  //                     setUserInfo(result.userInfo)
  //                     setStatus('scraping')
  //                     sendResponse(true)
  //                 } else {
  //                     setStatus('error')
  //                     sendResponse(true)
  //                 }
  //             })
  //         }
  //         return true
  //     })
  // }, [])

  async function startScrapping(e) {
    e.preventDefault()
    try {
      setStatus('scraping')
      const keywordList = keyword.split('\n')
      let keywords: any = []
      for (const keyword of keywordList) {
        setCurrentKeyword(keyword)
        const scrapped_result = await fetchResultsFromKeyword({ keyword })
        keywords.push(scrapped_result)
        console.log({ [keyword]: scrapped_result })
      }
      //@ts-ignore
      setTags((prev) => [...prev, { tag, keywords }])
      setStatus('completed')
      setCurrentKeyword('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log({ keywords: tags })
  }, [tags])

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='max-w-md px-6 py-8 bg-white shadow-lg rounded-lg w-[600px]'>
        <h3 className='text-xl font-semibold mb-4'>Scraping By Keywords</h3>
        <form onSubmit={startScrapping} className='my-2'>
          <div className='mb-4'>
            <label htmlFor='asin' className='block mb-2'>
              Enter Keywords:
            </label>
            <textarea
              name='asin'
              id='asin'
              required
              value={keyword}
              rows={5}
              onFocus={() => setStatus('ideal')}
              onChange={(e) => setKeyword(e.target.value)}
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
                style={{ width: `${getPercent(currentKeyword, keyword.split('\n'))}%` }}
              ></div>
            </div>
            <div>{getPercent(currentKeyword, keyword.split('\n')).toFixed(0) + '%'}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default ScrapeByKeyword
