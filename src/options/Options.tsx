import { useEffect, useState } from 'react'
import '../tailwindcss/output.css'
import ScrapeByAsin from './components/ScrapeByAsin'
import ScrapeByKeyword from './components/ScrapeByKeyword'
import { ToastContainer } from 'react-toastify'
import { getToken, notify } from '../utils'
import 'react-toastify/dist/ReactToastify.css'
import { SpinnerLoader } from '../utils/Loaders'
import { userAtom } from './recoil'
import { useRecoilState } from 'recoil'

// Login with: 15677676824 / CNv$c8nzLkjb.

function App() {
  const [isKey, setIsKey] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useRecoilState(userAtom)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function formSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const result: any = await getToken({ phone: userInfo.phone, password: userInfo.password })
    if (result?.token) {
      setLoading(false)
      notify('Data Saved!', 'success')
      setUserInfo({ ...userInfo, token: result.token })
      chrome.storage.local.set(
        {
          user: {
            phone: userInfo.phone,
            password: userInfo.password,
            token: result.token,
          },
        },
        () => {
          setIsSaved(true)
        },
      )
    } else {
      setLoading(false)
      notify('No user found!', 'error')
    }
  }

  useEffect(() => {
    chrome.storage.local.get(['user']).then((res: any) => {
      setUserInfo(res.user)
    })
  }, [])

  return (
    <main className="flex items-center justify-center h-screen gap-x-12">
      <div>
        <div className="border p-3 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Sytecho Keywords System Login</h3>
          <form onSubmit={formSubmit} className="max-w-md">
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                required
                value={userInfo?.phone ?? ''}
                onFocus={() => setIsSaved(false)}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={userInfo?.password ?? ''}
                onFocus={() => setIsSaved(false)}
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-center flex-col">
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 items-center justify-center flex text-white rounded-md"
                disabled={isSaved}
              >
                {loading ? <SpinnerLoader className="w-5 h-5" /> : isSaved ? 'Saved' : 'Save'}
              </button>
              {isSaved && <div className="text-center text-green-600 my-2">{'Data Saved'}</div>}
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col  justify-center mt-6">
        <div className="flex justify-center gap-x-6">
          <button
            className={`text-2xl font-bold ${!isKey ? 'underline text-blue-600' : ''}`}
            onClick={() => setIsKey(false)}
          >
            Asin
          </button>
          <button
            className={`text-2xl font-bold ${isKey ? 'underline text-blue-600' : ''}`}
            onClick={() => setIsKey(true)}
          >
            Keyword
          </button>
        </div>
        {!isKey && <ScrapeByAsin />}
        {isKey && <ScrapeByKeyword />}
      </div>
      <ToastContainer />
    </main>
  )
}

export default App
