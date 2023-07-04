var currentUrl = ''
export function detectURLChange(callback: any, interval = 1000) {
  setInterval(function () {
    if (window.location.href !== currentUrl) {
      callback()
      currentUrl = window.location.href
    }
  }, interval)
}

export async function fetchResults({ asin, userInfo }) {
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

  const scrapped_result = await fetch(
    `https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many_history/${asin_search_many.data}/?page=1&size=10000&qt=wm`,
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

  return scrapped_result
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
