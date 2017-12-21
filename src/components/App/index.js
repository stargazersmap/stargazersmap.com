import React from 'react'

import Resolver from '../../lib/Resolver'
import { makeUserFeature } from '../../utils/map'
import * as Errors from '../../constants/errors'
import { trackVisualization } from '../../utils/tracking'
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
      isFetching: null,
      data: { features: [] },
      error: null,
      showIntro: true,
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

  handleFetchStargazers = ({ stargazers }) => {
    if (!stargazers || stargazers.length < 1) {
      const e = new Error(Errors.REPO_HAS_NO_STARGAZERS)
      e.response = { status: 204 }
      throw e
    }

    Promise.all(
      stargazers.reduce((list, username) =>
        list.concat(
          Resolver.fetchUser(username)
            .then(this.handleFetchUser)
        ), [])
    ).then(() => {
      this.setState({
        showIntro: false,
      })
    })
  }

  handleFetchUser = (user) => {
    if (!user.lng || !user.lat) {
      // Stargazer could not be located. Silently ignoring.
    } else {
      this.addUserToMapData(user)
    }
    return user
  }

  handleHashChange = () => {
    this.resolveFromLocation()
  }

  handleMapReady = () => {
    if (window.location.hash.substr(1)) {
      this.resolveFromLocation()
    }
  }

  resolveRepository = ({ owner, repository }) => {
    if (this.state.isFetching) {
      return
    }

    this.setState({
      data: { features: [] },
      error: '',
      isFetching: true,
      owner,
      repository,
    })

    Resolver.fetchStargazers({ owner, repository })
      .then(this.handleFetchStargazers)
      .then(() => {
        this.setState({ isFetching: null })
        trackVisualization({ owner, repository })
      })
      .catch((err) => {
        this.setState({ isFetching: null })
        const status = err.response && err.response.status
        switch (status) {
          case 204:
            this.handleError(Errors.REPO_HAS_NO_STARGAZERS)
            break
          case 404:
            this.handleError(Errors.FETCH_STARGAZERS_404, { owner, repository })
            break
          default:
            this.handleError(Errors.FETCH_STARGAZERS, { owner, repository })
        }
      })
  }

  handleError = (error) => {
    this.setState({ error })
  }

  handleSearchSubmit = (query) => {
    const [owner, repository] = query.split('/')

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
      <div className="app">
        <UserControls showIntro={showIntro}>
          <Search
            isFetching={isFetching}
            onError={this.handleError}
            onSubmit={this.handleSearchSubmit}
            owner={owner}
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
      </div>
    )
  }
}

export default App
