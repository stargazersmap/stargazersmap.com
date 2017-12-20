import React from 'react'

import './styles.css'

class Search extends React.Component {
  render () {
    const { isFetching } = this.props

    return (
      <div className='search'>
        <input
          className='search__input'
          disabled={!!isFetching}
          placeholder='username/repository'
        />
      </div>
    )
  }
}

export default Search
