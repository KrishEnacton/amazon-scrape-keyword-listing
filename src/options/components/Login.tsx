import { useLayoutEffect } from 'react'
import { getCreds, getToken, isLoggedIn } from '../../utils'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate()
  useLayoutEffect(() => {
    chrome.runtime.sendMessage(
      {
        from: 'login',
        action: 'GET_COOKIES',
      },
      (res) => {
        if (res?.cookies.length > 1) {
          navigate('/asin')
          getCreds().then((res) => {
            const creds = res.credentials
            getToken({ phone: creds?.user_name, password: creds?.password }).then((res: any) => {
              chrome.storage.local.set({
                user: {
                  phone: creds.user_name,
                  password: creds.password,
                  token: res.token,
                },
              })
            })
          })
        } else navigate('/')
      },
    )
  }, [])
  return (
    <div className="w-2/6 h-screen   my-16 items-center justify-center gap-x-12 mx-auto">
      <div className="flex flex-col rounded-md m-6">
        <div className="mt-3 text-center sm:mt-5 ">Amazon ASIN</div>
        <div className="mt-5 sm:mt-6">
          <a href="https://keywords.aiamzads.com/user/login" target="_blank">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
