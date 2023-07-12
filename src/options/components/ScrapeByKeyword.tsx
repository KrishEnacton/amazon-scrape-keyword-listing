import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import {
  fetchResultsFromKeyword,
  getPercent,
  notify,
  fetchAPI,
  generateRandomString,
  sleep,
} from '../../utils'
import { arrayAtomFamily, arrayAtomObject, counterAtom } from '../recoil'
import { SpinnerLoader } from '../../utils/Loaders'
import { Config } from '../../config'
import { fileProps } from '../../global'
import CustomModal from '../generic/CustomModal'

const ScrapeByKeyword: React.FC<{}> = ({}) => {
  const [keyword, setKeyword] = useState<string>('')
  const [status, setStatus] = useState('ideal')
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [counter, setCounter] = useRecoilState(counterAtom)
  const [file, setFile] = useState<string>(``)
  const [batch, setBatch] = useState<any>()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<{ fetch?: boolean; store?: boolean; error?: boolean }>({
    fetch: false,
    store: false,
    error: false,
  })
  const keywordList = keyword
    .trim()
    .split('\n')
    .filter((a) => a)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }
  async function startScrapping(e: any) {
    let batch_id = generateRandomString(14)
    e.preventDefault()
    setStatus('scraping')
    try {
      const keywordList = keyword
        .trim()
        .split('\n')
        .filter((a) => a)
      for (const keyword of keywordList) {
        setCurrentKeyword(keyword)
        setLoading({ fetch: true })
        const scrapped_result = await fetchResultsFromKeyword({ keyword })
        setLoading({ fetch: false })
        if (!scrapped_result) {
          setLoading({ error: true })
          // notify('Something went wrong', 'error')
        }
        if (scrapped_result) {
          const body = {
            batch_name: batch,
            keyword: scrapped_result.prefix,
            suggestions: scrapped_result.suggestions,
          }
          const storeBody = {
            group_name: batch,
            source: 'amazon_dropdown',
            query_items: keywordList,
            batch_id: batch_id,
            keywords: body.suggestions.map((k) => ({ keywords: k.value })),
          }
          if (body.keyword && body.suggestions && storeBody.keywords.length > 0) {
            setLoading({ store: true })
            await sleep(2000)
            const result: fileProps = await fetchAPI(Config.keyword_store, storeBody)
            if (result.file_url) {
              setLoading({ store: false })
              setFile(result.file_url)
            }
          }
          console.log({ [keyword]: scrapped_result })
          setCounter((prev) => prev + 1)
        }
      }
      setCurrentKeyword('')
      setStatus('completed')
      setCounter(0)
      notify('Scraping Done!', 'success')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-md px-6 py-6 bg-white shadow-lg rounded-lg w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Scraping By Keywords</h3>
        <form className="my-2">
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
              Enter Group Name: <span className="text-red-500 text-lg">*</span>
            </label>
            <input
              type="text"
              name="keyword-batch"
              id="keyword-batch"
              required
              onChange={(e) => setBatch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
            />
          </div>
          <div className="flex flex-col items-center">
            <div>
              {loading.fetch ? (
                <span>
                  Keyword searching:<span className="font-bold">{` ${currentKeyword}`}</span>
                  {` (${keywordList.indexOf(currentKeyword) + 1} / ${keywordList.length})`}
                </span>
              ) : loading.error ? (
                `Fetching keywords failed for ${currentKeyword}, skipping...`
              ) : loading.store ? (
                <span>
                  Keyword storing:<span className="font-bold">{` ${currentKeyword}`}</span>
                  {` (${keywordList.indexOf(currentKeyword) + 1} / ${keywordList.length})`}
                </span>
              ) : (
                ``
              )}
            </div>
            <div className="flex justify-center gap-x-4">
              <div>
                <button
                  type="button"
                  onClick={batch && openModal}
                  disabled={status == 'scraping' ? true : false}
                  className={` bg-green-600 text-white rounded-md ${
                    status == 'scraping' ? 'px-10 py-3' : 'px-4 py-2'
                  }`}
                >
                  {status == 'scraping' ? <SpinnerLoader className="h-4 w-4" /> : 'Start Scraping'}
                </button>
                <CustomModal
                  confirm={(e) => {
                    startScrapping(e)
                    closeModal()
                  }}
                  closeModal={closeModal}
                  isOpen={isOpen}
                  modal_title={`Start scrapping`}
                  modal_description={`This will save the searched keywords to the Keywords Lab ${batch}, and may overwrite your current data, are you sure to continue?`}
                />
              </div>
              {status == 'completed' && (
                <div className="mt-[7.5px]">
                  <a href={file} download className="px-4 py-3.5 bg-blue-600 text-white rounded-md">
                    Download CSV
                  </a>
                </div>
              )}
            </div>
          </div>
        </form>
        {status == 'scraping' && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 flex gap-x-2 justify-between">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${getPercent(counter, keyword.trim().split('\n').filter(Boolean))}%`,
                }}
              ></div>
            </div>
            <div>{getPercent(counter, keyword.trim().split('\n').filter(Boolean)) + '%'}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default ScrapeByKeyword
