import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { fetchResultsFromKeyword, getPercent, notify, postbinAPI } from '../../utils'
import { arrayAtomFamily, arrayAtomObject } from '../recoil'
import { SpinnerLoader } from '../../utils/Loaders'

const ScrapeByKeyword: React.FC<{}> = ({}) => {
  const [keyword, setKeyword] = useState<string>('')
  const [status, setStatus] = useState('ideal')
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [tags, setTags] = useRecoilState(arrayAtomFamily(arrayAtomObject.keywordTags))
  const [batch, setBatch] = useState<any>()

  async function startScrapping(e) {
    e.preventDefault()
    try {
      setStatus('scraping')
      const keywordList = keyword.split('\n')
      let keywords: any = []
      for (const keyword of keywordList) {
        setCurrentKeyword(keyword)
        const scrapped_result = await fetchResultsFromKeyword({ keyword })
        const body = {
          batch_name: batch,
          keyword: scrapped_result.prefix,
          suggestions: scrapped_result.suggestions,
        }
        const postBin_result = await postbinAPI(
          'https://keywords.aiamzads.com/api/keyword-store/amazon-search',
          body,
        )
        keywords.push(scrapped_result)
        console.log({ [keyword]: scrapped_result })
      }
      //@ts-ignore
      setTags((prev) => [...prev, { batch, keywords }])
      setCurrentKeyword('')
      setStatus('completed')
      notify('Scraping Done!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-md px-6 py-8 bg-white shadow-lg rounded-lg w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Scraping By Keywords</h3>
        <form onSubmit={startScrapping} className="my-2">
          <div className="mb-4">
            <label htmlFor="asin" className="block mb-2">
              Enter Keywords:
            </label>
            <textarea
              name="asin"
              id="asin"
              required
              value={keyword}
              rows={5}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
            ></textarea>
          </div>
          <div className="my-4">
            <label htmlFor="keyword-batch" className="block mb-2">
              Enter Batch Name: <span className="text-red-500 text-lg">*</span>
            </label>
            <input
              type="text"
              name="keyword-batch"
              id="keyword-batch"
              onChange={(e) => setBatch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
            />
          </div>
          <div className="flex justify-center gap-x-4">
            <div className="my-2">
              <button
                type="submit"
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
