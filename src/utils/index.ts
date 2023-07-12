import { toast } from 'react-toastify'
import { fileProps } from '../global'

var currentUrl = ''
export function detectURLChange(callback: any, interval = 1000) {
  setInterval(function () {
    if (window.location.href !== currentUrl) {
      callback()
      currentUrl = window.location.href
    }
  }, interval)
}

export async function fetchResults({ asin, userInfo }): Promise<any> {
  return new Promise(async function (resolve) {
    const asin_search_many = await fetch(
      'https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many/',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          token: `${userInfo.token}`,
        },
        body: `{"asins":["${asin}"],"marketplace":"US"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
      },
    ).then((res) => res.json())

    if (asin_search_many.data) {
      const scrapped_result = await fetch(
        `https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many_history/${asin_search_many?.data}/?page=1&size=1000000&qt=wm`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            token: `${userInfo.token}`,
          },
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        },
      ).then((res) => res.json())
      resolve(scrapped_result)
    } else {
      resolve(false)
    }
  })
}

export async function fetchResultsFromKeyword({ keyword }) {
  const scrapped_result = await fetch(
    `https://completion.amazon.com/api/2017/suggestions?limit=11&prefix=${keyword}&suggestion-type=WIDGET&suggestion-type=KEYWORD&alias=aps&site-variant=desktop&version=3&event=onkeypress&lop=en_US&mid=ATVPDKIKX0DER`,
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-GB,en;q=0.5',
      },
      referrer: 'https://www.amazon.com/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    },
  ).then((res) => res.json())
  return scrapped_result
}

export async function getToken({ phone, password }) {
  return new Promise((resolve) => {
    fetch('https://www.cijiang.net/cijiang/v1/user/login/', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarytyHr7HyTaYQ1688f',
      },
      referrer: 'https://cijiang.net/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `------WebKitFormBoundarytyHr7HyTaYQ1688f\r\nContent-Disposition: form-data; name="username"\r\n\r\n${phone}\r\n------WebKitFormBoundarytyHr7HyTaYQ1688f\r\nContent-Disposition: form-data; name="password"\r\n\r\n${password}\r\n------WebKitFormBoundarytyHr7HyTaYQ1688f--\r\n`,
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        resolve(data)
      })
  })
}

export function getPercent(counter: number, keywords: string[]): number {
  const index = counter
  const percent: number = +(((index + 1) / keywords.length) * 100).toFixed(0)
  return percent < 0
    ? 0
    : percent > 100
    ? 100
    : percent - +(100 / keywords.length).toFixed(0) === 0
    ? 5
    : percent - +(100 / keywords.length).toFixed(0)
}

export function fetchAPI(url: string, body: any): Promise<fileProps> {
  const options: any = {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(body),
  }
  return new Promise((resolve) => {
    fetch(url, options)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        resolve(data)
      })
  })
}

export const notify = (message: string, type?: string) => {
  if (type == 'error') toast.error(message)
  if (type == 'success') toast.success(message)
  if (type == 'warning') toast.warn(message)
}
