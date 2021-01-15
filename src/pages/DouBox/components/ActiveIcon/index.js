import React from 'react'
import TweenOne from 'rc-tween-one'
import img from '@utils/img'

const ActiveIcon = () => (
  <TweenOne
    // reverse
    animation={{
      yoyo: true,
      repeat: -1,
      rotate: '30deg',
      ease: 'easeInOutCirc',
      duration: '500'
    }}
    style={{
      transform: 'rotate(-30deg)',
      transformOrigin: 'center bottom',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <img
      className="top-icon"
      src={img.icon_zzdx}
      alt=""
    />
  </TweenOne>
)

export default ActiveIcon
