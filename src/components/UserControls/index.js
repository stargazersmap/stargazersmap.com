import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './styles.css'

class UserControls extends React.PureComponent {
  render () {
    return (
      <div
        className={classNames('user-controls', {
          // eslint-disable-next-line
          ['user-controls--minimized']: this.props.minimized,
        })}
      >
        {this.props.children}
      </div>
    )
  }
}

UserControls.propTypes = {
  minimized: PropTypes.bool,
}

export default UserControls
