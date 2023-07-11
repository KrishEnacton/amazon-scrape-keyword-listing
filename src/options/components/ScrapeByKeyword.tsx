import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { fetchResultsFromKeyword, getPercent, notify, fetchAPI } from '../../utils'
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
  const [tags, setTags] = useRecoilState(arrayAtomFamily(arrayAtomObject.keywordTags))
  const [file, setFile] = useState<string>(``)
  const [batch, setBatch] = useState<any>()
  const [isOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  async function startScrapping(e: any) {
    e.preventDefault()
    setStatus('scraping')
    try {
      const keywordList = keyword
        .trim()
        .split('\n')
        .filter((a) => a)
      console.log({ keywordList })
      for (const keyword of keywordList) {
        setCurrentKeyword(keyword)
        const scrapped_result = await fetchResultsFromKeyword({ keyword })
        const body = {
          batch_name: batch,
          keyword: scrapped_result.prefix,
          suggestions: scrapped_result.suggestions,
        }
        const storeBody = {
          group_name: batch,
          source: 'amazon_dropdown',
          query_items: keywordList,
          keywords: body.suggestions.map((k) => ({ keywords: k.value })),
        }
        if (body.keyword && body.suggestions) {
          const result: fileProps = await fetchAPI(Config.keyword_store, storeBody)
          if (result.file_url) {
            setFile(result.file_url)
          }
          console.log({ [keyword]: scrapped_result })
        }
        setCounter((prev) => prev + 1)
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
          <div className="flex justify-center gap-x-4">
            <div>
              <button
                type="button"
                onClick={openModal}
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
                modal_title={`Start scrapping!`}
                modal_description={`Are you sure you want to scrapping?`}
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
