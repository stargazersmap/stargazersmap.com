import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const SAD_EMOJIS = ['☹️', '😕', '😖', '😩', '😧', '😭', '🤔', '😬', '🤕']

const getRandomEmoji = () =>
  SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)]

class ErrorOutput extends React.Component {
  shouldComponentUpdate () {
    // Evil shit!
    return true
  }

  render () {
    const hasError =
      this.props.error &&
      this.props.error.length > 0

    return (
      <div className='error-output'>
        {hasError && (
          <div className='error-output__emoji'>{getRandomEmoji()}</div>
        )}
        {hasError && (
          <div className='error-output__msg'>{this.props.error}</div>
        )}
      </div>
    )
  }
}

ErrorOutput.propTypes = {
  error: PropTypes.string,
}

export default ErrorOutput
