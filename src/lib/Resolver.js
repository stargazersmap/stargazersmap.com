import fetchJSON from '../utils/fetchJSON'
import { parseRepoPath } from '../utils/github'
import * as Errors from '../constants/errors'

const API_BASE_URI = 'https://stargazersmap.com/v1'

class Resolver {
  static fetchStargazers ({ owner, repository }) {
    return fetchJSON(`${API_BASE_URI}/repo/${owner}/${repository}`)
  }

  static fetchNextPage (next) {
    return fetchJSON(next)
  }

  static fetchUser (username) {
    return fetchJSON(`${API_BASE_URI}/user/${username}`)
  }

  static parseHash (hash) {
    return new Promise((resolve, reject) => {
      let owner = null
      let repository = null

      try {
        [owner, repository] = parseRepoPath(hash)

        if (!owner || !repository) {
          throw (new TypeError(Errors.LOCATION_HASH_INVALID))
        }
      } catch (e) { reject(e) }

      resolve({ owner, repository })
    })
  }
}

export default Resolver
