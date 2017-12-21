import React from 'react'
import classNames from 'classnames'

import './styles.css'

class UserControls extends React.PureComponent {
  render () {
    return (
      <div
        className={classNames('user-controls', {
          ['user-controls--minimized']: !this.props.showIntro,
        })}
      >
        {this.props.children}
      </div>
    )
  }
}

export default UserControls
