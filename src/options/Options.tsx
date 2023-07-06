import { useEffect, useState } from 'react'
import '../tailwindcss/output.css'
import ScrapeByAsin from './components/ScrapeByAsin'
import ScrapeByKeyword from './components/ScrapeByKeyword'
import { ToastContainer } from 'react-toastify'
import { getToken, notify } from '../utils'
import 'react-toastify/dist/ReactToastify.css'

// Login with: 15677676824 / CNv$c8nzLkjb.

function App() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isKey, setIsKey] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.local.get((result) => {
      const { phone, password } = result.user
      setPhone(phone)
      setPassword(password)
    })
  }, [])

  async function formSubmit(e) {
    e.preventDefault()
    const userInfo: any = await getToken({ phone, password })
    if (userInfo.token) {
      notify('Data Saved!')
      chrome.storage.local.set({
        user: {
          phone,
          password,
          token: userInfo.token,
        },
      })
    }
  }

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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="px-8 py-2 bg-green-600 text-white rounded-md">
                Save
              </button>
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
        <ToastContainer />
      </div>
    </main>
  )
}

export default App
