import React from 'react'
import PropTypes from 'prop-types'

import {
  buildRepoPath,
  isValidRepoPath,
  parseRepoPath,
} from '../../utils/github'
import { KEY_CODE_ENTER } from '../../constants/key-codes'
import * as Errors from '../../constants/errors'
import './styles.css'

class Search extends React.Component {
  constructor () {
    super()

    this.input = null
    this.state = {
      inputValue: '',
      editing: false,
    }
  }

  sanitize = (str) => {
    return str
      .replace(/^-|[^a-z0-9-/]/ig, '')
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

  handleFocus = () => {
    const { owner, repository } = this.props

    const inputValue =
      this.state.inputValue ||
      (owner && repository && buildRepoPath({ owner, repository })) ||
      ''

    this.setState({ editing: true, inputValue })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === KEY_CODE_ENTER) {
      this.handleSubmit(e)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (this.props.isFetching) {
      return
    }

    const { inputValue } = this.state

    if (isValidRepoPath(inputValue)) {
      this.props.onSubmit(inputValue)
      this.input.blur()
      this.setState({ editing: false })
    } else {
      this.props.onError(Errors.GITHUB_HANDLE_INVALID)
    }
  }

  renderProxyChildren (str) {
    const parts = str.length
      ? parseRepoPath(str)
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
    const { isFetching, owner, repository } = this.props
    const { inputValue, editing } = this.state

    const value = editing || !owner || !repository
      ? inputValue
      : buildRepoPath({ owner, repository })

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
          disabled={isFetching}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={this.registerInputRef}
          spellCheck='false'
          value={value}
        />
        <div className='search__input-proxy'>
          {this.renderProxyChildren(value)}
        </div>
        {isFetching && <div className='search__busy'/>}
      </form>
    )
  }
}

Search.propTypes = {
  isFetching: PropTypes.bool,
  onError: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  owner: PropTypes.string,
  repository: PropTypes.string,
}

export default Search
