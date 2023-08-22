import React, { useEffect, useState } from 'react'
import { Login } from '../components/Login'
import FullScreenLoader from '../generic/FullScreenLoader'
import { useRecoilState } from 'recoil'
import { booleanAtomFamily } from '../recoil'

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isValidate, setIsValidate] = useRecoilState(booleanAtomFamily('isValid'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    chrome.storage.local.get('user').then((res) => {
      if (res?.user && Object.values(res?.user).length > 0) {
        setLoading(false)
        setIsValidate(true)
      }
    })
  }, [])

  console.log(isValidate, 'valid')
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
  if (!isValidate) {
    return (
      <div>
        <Login />
      </div>
    )
  }
}
