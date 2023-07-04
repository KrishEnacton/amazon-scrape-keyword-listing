import { useEffect, useState } from 'react'
import '../tailwindcss/output.css'
import ScrapeByAsin from './components/ScrapeByAsin'
import ScrapeByKeyword from './components/ScrapeByKeyword'

// Login with: 15677676824 / CNv$c8nzLkjb.

function App() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

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
    <main>
      <h3>Sytecho Keywords System Login</h3>
      <form onSubmit={formSubmit}>
        <div>
          Phone Number:{' '}
          <input
            type="text"
            name="phone"
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          Password:{' '}
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
      <ScrapeByAsin />
      <ScrapeByKeyword/>
    </main>
  )
}

export default App
