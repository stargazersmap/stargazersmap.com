import React from 'react'

import Resolver from '../../lib/Resolver'
import { makeUserFeature } from '../../utils/map'
import { buildRepoPath, parseRepoPath } from '../../utils/github'
import * as Errors from '../../constants/errors'
import { trackVisualization } from '../../utils/tracking'
import Credits from '../Credits'
import ErrorOutput from '../ErrorOutput'
import Map from '../Map'
import Search from '../Search'
import UserControls from '../UserControls'
import './styles.css'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.map = null

    this.state = {
      isFetching: false,
      data: { features: [] },
      error: null,
      showIntro: true,
      numTotal: 0,
      numResolved: 0,
    }
  }

  componentDidMount () {
    window.addEventListener('hashchange', this.handleHashChange)
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.handleHashChange)
  }

  addUserToMapData = (user) => {
    this.setState((state) => ({
      data: {
        features: state.data.features.concat(makeUserFeature(user)),
      },
    }))
  }

  catchFetchError = (err) => {
    this.setState({ isFetching: false })

    const status = err.response && err.response.status

    switch (status) {
      case 204:
        this.handleError(Errors.REPO_HAS_NO_STARGAZERS)
        break
      case 404:
        this.handleError(Errors.FETCH_STARGAZERS_404)
        break
      default:
        this.handleError(Errors.FETCH_STARGAZERS)
    }
  }

  fetchNextPage = (nextPage) => {
    Resolver.fetchNextPage(nextPage)
      .then(this.handleFetchStargazers)
      .catch(this.catchFetchError)
  }

  getProgress = () => {
    return this.state.numResolved / this.state.numTotal
  }

  handleFetchStargazers = ({ stargazers, _links, total }) => {
    this.setState((state) => ({
      showIntro: false,
      numTotal: state.numTotal === 0
        ? (total || stargazers.length)
        : state.numTotal,
    }))

    if (!stargazers || stargazers.length < 1) {
      const e = new Error(Errors.REPO_HAS_NO_STARGAZERS)
      e.response = { status: 204 }
      throw e
    }

    const nextPage = _links && _links.next && _links.next.href
    const done = () => { this.setState({ isFetching: false }) }
    const next = nextPage
      ? () => this.fetchNextPage(nextPage)
      : done

    Promise
      .all(
        stargazers.reduce((list, username) =>
          list.concat(
            Resolver.fetchUser(username)
              .then(this.handleFetchUser)
              .catch(this.noop)
          ), [])
      )
      .then(next)
  }

  handleFetchUser = (user) => {
    this.setState((state) => ({
      numResolved: state.numResolved + 1,
    }))

    if (!user.lng || !user.lat) {
      // Stargazer could not be located. Silently ignoring.
    } else {
      this.addUserToMapData(user)
    }

    return user
  }

  handleHashChange = () => {
    const [owner, repository] = parseRepoPath(window.location.hash.substr(1))

    if (
      owner && repository &&
      (owner !== this.state.owner || repository !== this.state.repository)
    ) {
      this.resolveFromLocation()
    }
  }

  handleMapReady = () => {
    if (window.location.hash.substr(1)) {
      this.resolveFromLocation()
    }
  }

  noop = () => {}

  resolveRepository = ({ owner, repository }) => {
    if (this.state.isFetching) {
      return
    }

    this.setState({
      data: { features: [] },
      error: '',
      isFetching: true,
      numTotal: 0,
      numResolved: 0,
      owner,
      repository,
    })

    const repoPath = buildRepoPath({ owner, repository })

    if (window.location.hash.indexOf(repoPath) < 0) {
      window.location.hash = repoPath
    }

    Resolver.fetchStargazers({ owner, repository })
      .then(this.handleFetchStargazers)
      .then(() => {
        trackVisualization({ owner, repository })
      })
      .catch(this.catchFetchError)
  }

  handleError = (error) => {
    this.setState({ error })
  }

  handleSearchSubmit = (query) => {
    const [owner, repository] = parseRepoPath(query)

    if (owner && repository) {
      this.resolveRepository({ owner, repository })
    }
  }

  resolveFromLocation = () => {
    const hash = window.location.hash.substr(1)

    if (hash.length > 0) {
      Resolver.parseHash(hash)
        .then(this.resolveRepository)
        .catch(() => {
          this.handleError(Errors.LOCATION_HASH_INVALID)
        })
    }
  }

  render () {
    const {
      data,
      error,
      isFetching,
      owner,
      repository,
      showIntro,
    } = this.state

    return (
      <div className='app'>
        <UserControls minimized={!showIntro}>
          <Search
            isFetching={isFetching}
            onError={this.handleError}
            onSubmit={this.handleSearchSubmit}
            owner={owner}
            progress={this.getProgress()}
            repository={repository}
          />
          <ErrorOutput
            error={error}
            owner={owner}
            repository={repository}
          />
        </UserControls>
        <Map
          data={data}
          onMapReady={this.handleMapReady}
        />
        <Credits/>
      </div>
    )
  }
}

export default App
