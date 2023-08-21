import React, { useLayoutEffect, useState } from 'react'
import { Login } from '../components/Login'

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isValidate, setIsValidate] = useState(false)

  useLayoutEffect(() => {
    chrome.storage.local.get('user').then((res) => {
      if (Object.values(res.user).length > 0) {
        setIsValidate(true)
      }
    })
  })
  if (isValidate) return <div>{children}</div>
  return (
    <div>
      <Login />
    </div>
  )
}
