import 'whatwg-fetch'

const fetchJSON = (url) =>
  fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then((response) => response.json())

export default fetchJSON
