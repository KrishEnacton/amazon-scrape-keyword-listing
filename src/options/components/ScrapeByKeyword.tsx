import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { fetchResultsFromKeyword, getPercent, notify, fetchAPI } from '../../utils'
import { arrayAtomFamily, arrayAtomObject } from '../recoil'
import { SpinnerLoader } from '../../utils/Loaders'
import { Config } from '../../config'
import { fileProps } from '../../global'

const ScrapeByKeyword: React.FC<{}> = ({}) => {
  const [keyword, setKeyword] = useState<string>('')
  const [status, setStatus] = useState('ideal')
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [tags, setTags] = useRecoilState(arrayAtomFamily(arrayAtomObject.keywordTags))
  const [file, setFile] = useState<string>(``)
  const [batch, setBatch] = useState<any>()

  async function startScrapping(e) {
    e.preventDefault()
    setStatus('scraping')
    try {
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
        const result: fileProps = await fetchAPI(Config.keyword_search, body)
        if (result.file_url) {
          setFile(result.file_url)
        }
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
            <div>
              <button
                type="submit"
                disabled={status == 'scraping' ? true : false}
                className={`px-4 py-2 bg-green-600 text-white rounded-md ${
                  status == 'scraping' ? 'px-10 py-3' : ''
                }`}
              >
                {status == 'scraping' ? <SpinnerLoader className="h-4 w-4" /> : 'Start Scraping'}
              </button>
            </div>
            {status == 'completed' && (
              <div className="mt-[7.5px]">
                <a href={file} download className="px-4 py-3.5 bg-blue-600 text-white rounded-md">
                  Download CSV
                </a>
              </div>
            )}
          </div>
        </form>
        {status == 'scraping' && (
          <>
            <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 flex gap-x-2 justify-between">
              <div
                className="bg-green-600 h-2.5 rounded-full"
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
