import React from 'react'
import PropTypes from 'prop-types'

import { KEY_CODE_ENTER } from '../../constants/key-codes'
import * as Errors from '../../constants/errors'
import './styles.css'

class Search extends React.Component {
  constructor () {
    super()

    this.input = null
    this.state = {
      inputValue: '',
    }
  }

  sanitize = (str) => {
    return str
      .toLowerCase()
      .replace(/^-|[^a-z0-9-/]/g, '')
      .replace(/-\/|\/-/, '/')
      .replace(/-{2,}/g, '-')
      .split('/')
      .slice(0, 2)
      .join('/')
  }

  handleChange = ({ target: { value } }) => {
    this.setState(() => ({
      inputValue: this.sanitize(value),
    }))
  }

  handleKeyDown = (e) => {
    if (e.keyCode === KEY_CODE_ENTER) {
      this.handleSubmit(e)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { inputValue } = this.state

    if (/^[a-z0-9-][a-z0-9-]*[a-z0-9]\/[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(inputValue)) {
      this.props.onSubmit(inputValue)
      this.input.blur()
    } else {
      this.props.onError(Errors.GITHUB_HANDLE_INVALID)
    }
  }

  renderProxyChildren (str) {
    const parts = str.length
      ? str.split('/')
      : ['owner', 'repository']

    return parts.length > 1
      ? [
        parts[0],
        <span key='slash' className='search__slash'>/</span>,
        parts[1],
      ]
      : parts
  }

  registerInputRef = (ref) => {
    this.input = ref
  }

  render () {
    const { isFetching } = this.props
    const { inputValue } = this.state

    return (
      <form
        className='search'
        onSubmit={this.handleSubmit}
      >
        <input
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          className='search__input'
          disabled={!!isFetching}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={this.registerInputRef}
          spellCheck='false'
          value={inputValue}
        />
        <div className='search__input-proxy'>
          {this.renderProxyChildren(inputValue)}
        </div>
        {isFetching && <div className='search__busy'/>}
      </form>
    )
  }
}

Search.propTypes = {
  onError: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default Search
