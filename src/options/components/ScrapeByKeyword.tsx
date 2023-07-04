import React, { useEffect, useState } from "react"
import { fetchResultsFromKeyword } from "../../utils"

const ScrapeByKeyword: React.FC<{}> = ({ }) => {
    const [keyword, setKeyword] = useState<string>('')
    const [status, setStatus] = useState('ideal')
    const [currentKeyword, setCurrentKeyword] = useState('')
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
            for (const keyword of keywordList) {
                setCurrentKeyword(keyword)
                const scrapped_result = await fetchResultsFromKeyword({ keyword })
                console.log({ [keyword]: scrapped_result })
            }
            setStatus('completed')
            setCurrentKeyword('')
        } catch (error) {
            console.log(error)
        }
    }

    function getPercent(currentKeyword: string, keyword: string[]) {
        const index = keyword.indexOf(currentKeyword)
        const percent: number = (index == -1 ? keyword.length - 1 : index / keyword.length) * 100
        return percent < 0 ? 0 : percent > 100 ? 100 : percent
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="max-w-md px-6 py-8 bg-white shadow-lg rounded-lg w-[600px]">
                <h3 className="text-xl font-semibold mb-4">Scraping By Keywords</h3>
                <form onSubmit={startScrapping} className="">
                    <div className="mb-4">
                        <label htmlFor="asin" className="block mb-2">Enter Keywords:</label>
                        <textarea
                            name="asin"
                            id="asin"
                            required
                            value={keyword}
                            rows={5}
                            onFocus={() => setStatus('ideal')}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        ></textarea>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Start Scraping</button>
                </form>
                {status !== 'ideal' && (
                    <>
                        <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 flex gap-x-2 justify-between">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${getPercent(currentKeyword, keyword.split("\n"))}%` }}></div>
                        </div>
                        <div>{getPercent(currentKeyword, keyword.split("\n")).toFixed(0) + "%"}</div>
                    </>
                )}
            </div>
        </div>

    )
}


export default ScrapeByKeyword