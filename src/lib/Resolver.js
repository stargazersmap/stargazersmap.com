import fetchJSON from '../utils/fetchJSON'

export const ERROR_HASH_MALFORMATTED = 'ERROR_HASH_MALFORMATTED'
const API_BASE_URI = 'https://stargazersmap.com/v1'

class Resolver {
  static fetchStargazers ({ profile, repository }) {
    return fetchJSON(`${API_BASE_URI}/repo/${profile}/${repository}`)
  }

  static fetchUser (username) {
    return fetchJSON(`${API_BASE_URI}/user/${username}`)
  }

  static parseHash (hash) {
    return new Promise((resolve, reject) => {
      let profile = null
      let repository = null

      try {
        [ profile, repository ] = hash.split('/')

        if (!profile || !repository) {
          throw (new TypeError(ERROR_HASH_MALFORMATTED))
        }
      } catch (e) { reject(e) }

      resolve({ profile, repository })
    })
  }
}

export default Resolver
