import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { fetchAPI, fetchResults, generateRandomString, getPercent, notify } from '../../utils'
import { counterAtom, userAtom } from '../recoil'
import { SpinnerLoader } from '../../utils/Loaders'
import { Config } from '../../config'
import { fileProps } from '../../global'
import CustomModal from '../generic/CustomModal'
import { AppLayout } from '../layouts/AppLayout'
import CustomSelect from '../generic/CusomSelect'
import { DashboardLayout } from '../layouts/DashboardLayout'

const ScrapeByAsin = () => {
  const [asin, setAsin] = useState('B07QXV6N1B\nB0725WFLMB\nB08GWPY8XP')
  const [status, setStatus] = useState('ideal')
  const [currentASIN, setCurrentASIN] = useState('')
  const [userInfo, setUserInfo] = useRecoilState(userAtom)
  const [counter, setCounter] = useRecoilState(counterAtom)
  const [loading, setLoading] = useState<{ fetch?: boolean; store?: boolean; error?: boolean }>({
    fetch: false,
    store: false,
    error: false,
  })
  const asinList = asin
    .trim()
    .split('\n')
    .filter((a) => a)
  const [file, setFile] = useState<string>(``)
  const [batch, setBatch] = useState<any>()
  const [isOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  async function startScrapping(e) {
    e.preventDefault()
    try {
      setStatus('logging')
      setStatus('scraping')
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
            let batch_id = generateRandomString(14)
            const asinList = asin
              .trim()
              .split('\n')
              .filter((a) => a)

            for (const _currentASIN of asinList) {
              setCurrentASIN(_currentASIN)
              setLoading({ fetch: true })
              const scrapped_result = await fetchResults({ asin: _currentASIN, userInfo })
              setLoading({ fetch: false })
              if (!scrapped_result) {
                setLoading({ error: true })
              }
              if (scrapped_result) {
                setLoading({ fetch: false })
                const body = {
                  batch_name: batch?.label,
                  ASIN: scrapped_result?.asin_infos?.[0] ?? [],
                  data: scrapped_result?.data || [],
                }
                const storeBody = {
                  group_name: batch?.label,
                  source: 'asin_reverse',
                  query_items: asinList,
                  batch_id: batch_id,
                  keywords: scrapped_result.data
                    .map((i) => ({
                      keywords: i.keyword,
                      keywords_chinese: i.keywords_dst,
                      word_count: i.number_of_roots,
                      monthly_search_volume: i.search_volume,
                      qty_competing_products: i.results,
                      competetion_index: i.comp_index,
                      click_share: i.top3_click_shared,
                      conversion_share: i.top3_convert_shared,
                      order_share: i.top3_proportion,
                      aba_ranking: null,
                    }))
                    .splice(0, 10),
                }
                if (body.ASIN && body.data && storeBody.keywords.length > 0) {
                  setLoading({ store: true })
                  const result: fileProps = await fetchAPI(Config.keyword_store, storeBody)
                  if (result.file_url) {
                    setLoading({ store: false })
                    setFile(result.file_url)
                  }
                }
              }
              console.log({ [_currentASIN]: scrapped_result })
              setCounter((prev) => prev + 1)
            }
            setStatus('completed')
            notify('Scraping Done!', 'success')
            setLoading({ error: false })
            setCounter(0)
            setCurrentASIN('')
          } catch (error) {
            console.log(error)
          }
          break
      }
    })()
  }, [status])

  const handleSelectChange = (selectedOption) => {
    setBatch(selectedOption)
  }
  return (
    <AppLayout>
      <DashboardLayout>
        <div className="flex flex-col items-center mt-10 justify-center">
          <div className="max-w-md px-6 py-6 bg-white shadow-lg rounded-lg w-[600px]">
            <h3 className="text-xl font-semibold mb-4">Scraping By ASIN</h3>
            <form className="my-2">
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
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                ></textarea>
              </div>
              <div className="my-4">
                <label htmlFor="keyword-batch" className="block mb-2">
                  Enter Group Name: <span className="text-red-500 text-lg">*</span>
                </label>
                <CustomSelect handleSelectChange={handleSelectChange} />
              </div>
              <div className="flex justify-center items-center gap-y-4 flex-col">
                <div>
                  {loading.fetch ? (
                    <span>
                      ASIN searching:<span className="font-bold">{` ${currentASIN}`}</span>
                      {` (${asinList.indexOf(currentASIN) + 1} / ${asinList.length})`}
                    </span>
                  ) : loading.error ? (
                    `Fetching keywords failed for ${currentASIN}, skipping...`
                  ) : loading.store ? (
                    <span>
                      ASIN storing:<span className="font-bold">{` ${currentASIN}`}</span>
                      {` (${asinList.indexOf(currentASIN) + 1} / ${asinList.length})`}
                    </span>
                  ) : (
                    ``
                  )}
                </div>
                <div className="flex gap-x-4">
                  <div>
                    <button
                      type="button"
                      onClick={batch?.label && openModal}
                      disabled={status == 'scraping' ? true : false}
                      className={`bg-green-600 text-white rounded-md ${
                        status == 'scraping' ? 'px-10 py-3' : 'px-4 py-2'
                      }`}
                    >
                      {status == 'scraping' ? (
                        <SpinnerLoader className="h-4 w-4" />
                      ) : (
                        'Start Scraping'
                      )}
                    </button>
                    <CustomModal
                      confirm={(e) => {
                        startScrapping(e)
                        closeModal()
                      }}
                      closeModal={closeModal}
                      isOpen={isOpen}
                      modal_title={`Start scrapping`}
                      modal_description={`This will save the searched keywords to the Keywords Lab ${batch?.label}, and may overwrite your current data, are you sure to continue?`}
                    />
                  </div>
                  {status == 'completed' && (
                    <div className="mt-[7.5px]">
                      <a
                        href={file}
                        download
                        className="px-4 py-3.5 bg-blue-600 text-white rounded-md"
                      >
                        Download CSV
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </form>
            {status == 'scraping' && (
              <>
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${getPercent(counter, asin.trim().split('\n').filter(Boolean))}%`,
                  }}
                ></div>

                <div>{getPercent(counter, asin.trim().split('\n').filter(Boolean)) + '%'}</div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AppLayout>
  )
}

export default ScrapeByAsin
