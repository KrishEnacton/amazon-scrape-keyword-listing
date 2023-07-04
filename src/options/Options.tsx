import { useEffect, useState } from 'react'
import '../tailwindcss/output.css'
import ScrapeByAsin from './components/ScrapeByAsin'
import ScrapeByKeyword from './components/ScrapeByKeyword'

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

  function formSubmit(e) {
    e.preventDefault()
    chrome.storage.local.set({
      user: {
        phone,
        password,
      },
    })
  }

  return (
    <main className='flex flex-col items-center justify-center h-screen'>
      <div className='border p-3 rounded-lg'>
        <h3 className='text-xl font-semibold mb-4'>Sytecho Keywords System Login</h3>
        <form onSubmit={formSubmit} className='max-w-md'>
          <div className='mb-4'>
            <label htmlFor='phone' className='block mb-2'>
              Phone Number:
            </label>
            <input
              type='text'
              name='phone'
              id='phone'
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block mb-2'>
              Password:
            </label>
            <input
              type='password'
              name='password'
              id='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
            />
          </div>
          <div className='flex justify-center'>
            <button type='submit' className='px-8 py-2 bg-blue-600 text-white rounded-md'>
              Save
            </button>
          </div>
        </form>
      </div>
      <div className='flex justify-between gap-x-4'>
        <button className='text-2xl font-bold' onClick={() => setIsKey(false)}>
          Asin
        </button>
        <button className='text-2xl font-bold' onClick={() => setIsKey(true)}>
          Keyword
        </button>
      </div>
      <div className='flex gap-x-6 justify-center mt-6'>
        {!isKey && <ScrapeByAsin />}
        {isKey && <ScrapeByKeyword />}
      </div>
    </main>
  )
}

export default App
