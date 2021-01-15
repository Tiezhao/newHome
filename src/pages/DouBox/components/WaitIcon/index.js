import React from 'react'
import TweenOne from 'rc-tween-one'
import PropTypes from 'prop-types'
import img from '@utils/img'

const WaitIcon = ({ paused = false }) => (

  <TweenOne
    paused={paused}
    animation={{
      rotate: '360deg',
      repeat: -1,
      ease: 'easeInOutCirc',
      duration: '1000'
    }}
    style={{transformOrigin: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
  >
    <img
      className="top-icon"
      src={img.icon_zzdd}
      alt=""
    />
  </TweenOne>
)

WaitIcon.propTypes = {
  paused: PropTypes.bool
}

export default WaitIcon
