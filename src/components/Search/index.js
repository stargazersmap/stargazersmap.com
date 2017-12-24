import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import {
  buildRepoPath,
  isValidRepoPath,
  parseRepoPath,
} from '../../utils/github'
import { KEY_CODE_ENTER } from '../../constants/key-codes'
import * as Errors from '../../constants/errors'
import ProgressBar from '../ProgressBar'
import './styles.css'

class Search extends React.Component {
  constructor () {
    super()

    this.input = null
    this.state = {
      inputValue: '',
      editing: false,
      contentOverflowing: false,
    }
  }

  componentWillUpdate (_, nextState) {
    if (this.input) {
      const { contentOverflowing } = this.state

      if (
        this.input.scrollWidth > this.input.clientWidth &&
        (
          !contentOverflowing ||
          contentOverflowing !== nextState.contentOverflowing
        )
      ) {
        this.setState({ contentOverflowing: true })
      } else if (
        contentOverflowing &&
        (
          contentOverflowing !== nextState.contentOverflowing ||
          this.input.scrollWidth <= this.input.clientWidth
        )
      ) {
        this.setState({ contentOverflowing: false })
      }
    }
  }

  sanitize = (str) => {
    const INVALID_CHARS = /[^a-z0-9-/._]/gi
    const INVALID_OWNER_CHARS = /[^a-z0-9-]/g
    const MULTIPLE_DASHES = /-{2,}/g
    const MATCHSTICK_ARMS = /^-|-$/

    let [owner, repository] = parseRepoPath(str.replace(INVALID_CHARS, ''))

    owner = owner
      .replace(INVALID_OWNER_CHARS, '')
      .replace(MATCHSTICK_ARMS, '')
      .replace(MULTIPLE_DASHES, '-') ||
      ''

    return typeof repository !== 'undefined'
      ? `${owner}/${repository}`
      : owner
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
        <span key='owner' className='search__owner'>{parts[0]}</span>,
        <span key='slash' className='search__slash'>/</span>,
        <span key='repository' className='search__repository'>{parts[1]}</span>,
      ]
      : parts
  }

  registerInputRef = (ref) => {
    this.input = ref
  }

  render () {
    const { isFetching, owner, progress, repository } = this.props
    const { contentOverflowing, editing, inputValue } = this.state

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
        <div
          className={classnames('search__input-proxy', {
            'search__input-proxy--overflowing': contentOverflowing,
          })}
        >
          {this.renderProxyChildren(value)}
        </div>
        {isFetching && <div className='search__busy'/>}
        {!isNaN(progress) && (
          <ProgressBar
            className='search__progress'
            isFetching={isFetching}
            progress={progress}
          />
        )}
      </form>
    )
  }
}

Search.propTypes = {
  isFetching: PropTypes.bool,
  onError: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  owner: PropTypes.string,
  progress: PropTypes.number,
  repository: PropTypes.string,
}

export default Search
