import React from 'react'

import Resolver from '../../lib/Resolver'
import { makeUserFeature } from '../../utils/map'
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
      this.handleError('Awww man! This repo has no stars yet.')
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

  handleMapReady = () => {}

  resolveRepository = ({ profile, repository }) => {
    this.setState({
      data: { features: [] },
      isFetching: {
        profile,
        repository,
      },
    })

    Resolver.fetchStargazers({ profile, repository })
      .then(this.handleFetchStargazers)
      .then(() => {
        this.setState({ isFetching: null, error: '' })
      })
      .catch((err) => {
        this.setState({ isFetching: null })
        const status = err.response && err.response.status
        switch (status) {
          case 404:
            this.handleError(`Those pesky 404’s! \`${profile}/${repository}\` does not seem to exist. Are you sure you spelled it correctly?`)
            break
          default:
            this.handleError(`Had some problems fetching the stargazers for ${profile}/${repository}. So sorry for this!`)
        }
      })
  }

  handleError = (error) => {
    this.setState({ error })
  }

  handleSearchSubmit = (query) => {
    const [profile, repository] = query.split('/')

    if (profile && repository) {
      this.resolveRepository({ profile, repository })
    }
  }

  resolveFromLocation = () => {
    const hash = window.location.hash.substr(1)

    if (hash.length > 0) {
      Resolver.parseHash(hash)
        .then(this.resolveRepository)
        .catch(() => {
          this.handleError('That does not look like a good hash in the address bar.')
        })
    }
  }

  render () {
    const { data, error, isFetching, showIntro } = this.state
    return (
      <div className="app">
        <UserControls showIntro={showIntro}>
          <Search
            isFetching={isFetching}
            onError={this.handleError}
            onSubmit={this.handleSearchSubmit}
          />
          <ErrorOutput error={error}/>
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
