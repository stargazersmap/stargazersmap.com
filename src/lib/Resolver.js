import fetchJSON from '../utils/fetchJSON'

export const ERROR_HASH_MALFORMATTED = 'ERROR_HASH_MALFORMATTED'

class Resolver {
  static fetchStargazers ({ profile, repository }) {
    return fetchJSON(`https://stargazersmap.com/v1/repo/${profile}/${repository}`)
  }

  static fetchUser (username) {
    return fetchJSON(`https://stargazersmap.com/v1/user/${username}`)
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
      } catch (e) {
        reject({
          error: { message: 'The supplied hash was malformatted.', type: e.message },
        })
      }

      resolve({ profile, repository })
    })
  }
}

export default Resolver
