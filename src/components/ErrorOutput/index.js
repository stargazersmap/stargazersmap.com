import React from 'react'
import PropTypes from 'prop-types'

import template from '../../utils/template'
import errorMessages from './error-messages'
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
    const { error, owner, repository } = this.props
    const hasError = error && error.length > 0
    const readableMsg = errorMessages[error] || errorMessages.DEFAULT

    return (
      <div className='error-output'>
        {hasError && (
          <div className='error-output__emoji'>{getRandomEmoji()}</div>
        )}
        {hasError && (
          <div className='error-output__msg'>
            {template(readableMsg, { owner, repository })}</div>
        )}
      </div>
    )
  }
}

ErrorOutput.propTypes = {
  error: PropTypes.string,
  owner: PropTypes.string,
  respository: PropTypes.string,
}

export default ErrorOutput
