import React, { useLayoutEffect, useState } from 'react'
import { Login } from '../components/Login'
import FullScreenLoader from '../generic/FullScreenLoader'

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isValidate, setIsValidate] = useState(false)
  const [loading, setLoading] = useState(false)

  useLayoutEffect(() => {
    setLoading(true)
    chrome.storage.local.get('user').then((res) => {
      if (res?.user && Object.values(res?.user).length > 0) {
        setIsValidate(true)
        setIsValidate(true)
      }
    })
  }, [])
  if (loading) {
    return (
      <FullScreenLoader
        className={'flex h-screen w-screen justify-center items-center text-red-300'}
      />
    )
  }

  if (isValidate) {
    return <div className="py-4">{children}</div>
  }
  return (
    <div>
      <Login />
    </div>
  )
}
