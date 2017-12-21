import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './styles.css'

class UserControls extends React.PureComponent {
  render () {
    const { minimized } = this.props

    return (
      <div
        className={classnames('user-controls', {
          ['user-controls--minimized']: minimized,
        })}
      >
        <div className={classnames('title', {
          ['title--minimized']: minimized,
        })}>
          ✨ The Stargazer’s Map
          {!minimized && ' ✨'}
        </div>
        <div className={classnames('intro', {
          ['intro--minimized']: minimized,
        })}>
          Enter a GitHub repo path to see its stargazers.
        </div>
        {this.props.children}
      </div>
    )
  }
}

UserControls.propTypes = {
  minimized: PropTypes.bool,
}

export default UserControls
