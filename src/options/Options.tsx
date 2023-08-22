import '../tailwindcss/output.css'
import ScrapeByAsin from './components/ScrapeByAsin'
import ScrapeByKeyword from './components/ScrapeByKeyword'
import 'react-toastify/dist/ReactToastify.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import { ToastContainer } from 'react-toastify'

// Login with: 15677676824 / CNv$c8nzLkjb.

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/asin" element={<ScrapeByAsin />} />
        <Route path="/keyword" element={<ScrapeByKeyword />} />
      </Routes>
      <ToastContainer />
    </HashRouter>
  )
}

export default App
