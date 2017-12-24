import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './styles.css'

const ProgressBar = ({ className, isFetching, progress }) => (
  <div
    className={classnames(className, 'progress-bar', {
      'progress-bar--hide': !isFetching,
    })}
  >
    <div
      className='progress-bar__progress'
      style={{
        width: `${progress * 100}%`,
      }}
    />
  </div>
)

ProgressBar.propTypes = {
  className: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
}

export default ProgressBar
