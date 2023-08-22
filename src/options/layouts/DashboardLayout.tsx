import { Link, useLocation } from 'react-router-dom'

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()

  return (
    <div className="flex flex-col mx-auto items-center justify-center mt-6">
      <nav className="flex gap-x-6 text-xl font-semibold">
        <Link
          to={'/asin'}
          className={`text-blue-600 ${location.pathname.includes('asin') ? 'underline' : ''}`}
        >
          <div>ASIN</div>
        </Link>
        <Link
          to={'/keyword'}
          className={`text-blue-600 ${location.pathname.includes('keyword') ? 'underline' : ''}`}
        >
          <div>Keywords</div>
        </Link>
      </nav>
      {children}
    </div>
  )
}
