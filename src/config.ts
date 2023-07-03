export const Config = {
  login_page: 'https://cijiang.net/user/login',
  selectors: {
    phone_number_field: '[type=text].el-input__inner',
    password_field: '[type=password].el-input__inner',
    login_button: '.el-button--primary.el-button--large',
  },
}

/* 
  1. https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many/previous-searches/
  fetch("https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many/previous-searches/", {
      "headers": {
        "accept": "application/json, text/plain, *\/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTIzLCJ1c2VybmFtZSI6IjE1Njc3Njc2ODI0IiwiZXhwIjoxNjkwOTY4NTQwfQ.s00Sd4gocWWHEfhnmULDRslVPyY1UThH8oacgAUqyzA"
      },
      "referrer": "https://cijiang.net/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"asins\":[\"B07QXV6N1B\"],\"marketplace\":\"US\"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    res: {
        "has_history_id": true,
        "data": "64a28746794df3303229fcde"
    }


  2. https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many/
  fetch("https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many/", {
    "headers": {
      "accept": "application/json, text/plain, *\/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTIzLCJ1c2VybmFtZSI6IjE1Njc3Njc2ODI0IiwiZXhwIjoxNjkwOTY4NTQwfQ.s00Sd4gocWWHEfhnmULDRslVPyY1UThH8oacgAUqyzA"
    },
    "referrer": "https://cijiang.net/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"asins\":[\"B07QXV6N1B\"],\"marketplace\":\"US\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  });
  res: {data: "64a29584fba1831bba2ca473"}

  3. https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many_history/?page=1&size=20&marketplace=US&query_type=many
  fetch("https://www.cijiang.net/cijiang/v2/uj_search/asin_search_many_history/?page=1&size=20&marketplace=US&query_type=many", {
    "headers": {
      "accept": "application/json, text/plain, *\/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTIzLCJ1c2VybmFtZSI6IjE1Njc3Njc2ODI0IiwiZXhwIjoxNjkwOTY4NTQwfQ.s00Sd4gocWWHEfhnmULDRslVPyY1UThH8oacgAUqyzA"
    },
    "referrer": "https://cijiang.net/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  });
  
*/
