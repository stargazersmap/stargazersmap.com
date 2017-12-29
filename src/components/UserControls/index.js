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
          'user-controls--minimized': minimized,
        })}
      >
        <div className={classnames('title', {
          'title--minimized': minimized,
        })}>
          <span className='title__emoji' role='img' aria-label='sparkles'>✨</span>
          <span><a href="https://github.com/stargazersmap/stargazersmap.com">Stargazer's Map</a></span>
          {!minimized && (
            <span className='title__emoji' role='img' aria-label='sparkles'>✨</span>
          )}
        </div>
        <div className={classnames('intro', {
          'intro--minimized': minimized,
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
