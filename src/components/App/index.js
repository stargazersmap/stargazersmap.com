import React from 'react'

import Resolver from '../../lib/Resolver'
import { makeUserFeature } from '../../utils/map'
import Search from '../Search'
import Map from '../Map'
import './styles.css'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.map = null

    this.state = {
      isFetching: null,
      data: { features: [] },
    }
  }

  componentDidMount () {
    window.addEventListener('hashchange', this.handleHashChange)
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.handleHashChange)
  }

  addUser = (user) => {
    this.setState((state) => ({
      data: {
        features: state.data.features.concat(makeUserFeature(user)),
      },
    }))
  }

  handleFetchStargazers = ({ stargazers }) => {
    if (!stargazers || stargazers.length < 1) {
      console.warn('Found no stargazers.')
    }

    stargazers.forEach((username) => {
      Resolver.fetchUser(username).then(this.handleFetchUser)
    })
  }

  handleFetchUser = (user) => {
    if (!user.lng || !user.lat) {
      console.warn('Stargazer could not be located.', user)
    } else {
      this.addUser(user)
    }
  }

  handleHashChange = () => {
    Resolver.parseHash(window.location.hash.substr(1)).then(this.handleParseHash).catch(console.warn.bind('Error in `parseHash`.'))
  }

  handleMapReady = () => {
    // TODO: do something else here
    Resolver.parseHash(window.location.hash.substr(1)).then(this.handleParseHash).catch(console.warn.bind('Error in `parseHash`'))
  }

  handleParseHash = ({ profile, repository }) => {
    this.setState({
      isFetching: {
        profile,
        repository,
      },
    })

    Resolver.fetchStargazers({ profile, repository }).then(this.handleFetchStargazers).then(() => {
      this.setState({ isFetching: null })
    }).catch(console.warn.bind('Error in `fetchStargazers`.'))
  }

  render () {
    return (
      <div className="app">
        <Search isFetching={this.state.isFetching}/>
        <Map data={this.state.data} onMapReady={this.handleMapReady}/>
      </div>
    )
  }
}

export default App
