import React, { useState, useEffect } from 'react'
import { toJS } from 'mobx'
import TweenOne from 'rc-tween-one'
import PropTypes from 'prop-types'
import './index.less'

const GunIndex = 18

const PlayGameBox = ({ gunBgList, animateFinish, step }) => {
  const [animate, changeAni] = useState({
    moment: null,
    paused: true,
  })


  useEffect(() => {
    if (animate.moment === 0) {
      changeAni({
        moment: null,
        paused: false,
      })
    }
  }, [animate])

  useEffect(() => {
    changeAni({
      moment: 0,
      paused: false
    })
    console.log('step', step);
  }, [step])

  return (
    <div className="move-wrap">
      <TweenOne
        className='move-box'
        paused={animate.paused}
        moment={animate.moment}
        resetStyle
        animation={{
          y: -300 * GunIndex,
          ease: 'easeInOutExpo',
          duration: 2000,
        }}
      >
        {gunBgList && gunBgList.map((e, i) => (
          <li key={e + i} className="move-item">
            {GunIndex === i ? (
              <TweenOne
                className='move-box'
                paused={animate.paused}
                moment={animate.moment}
                resetStyle
                animation={{
                  scale: 1.5,
                  ease: 'easeInOutExpo',
                  duration: 500,
                  delay: 2000
                }}
              >
                <img
                  className='gun-icon'
                  src={e.detail && e.detail.icon_url}
                />
                <TweenOne
                  component='p'
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '14px',
                    transformOrigin: 'center',
                    transform: 'scaleX(0)',
                    opacity: '0'
                  }}
                  paused={animate.paused}
                  moment={animate.moment}
                  resetStyle
                  animation={{
                    opacity: 1,
                    scaleX: 1,
                    ease: 'easeInOutExpo',
                    duration: 500,
                    delay: 2000
                  }}
                >
                  {e.detail && e.detail.item_name}
                </TweenOne>
              </TweenOne>
            ) : (
              <img
                className='gun-icon'
                src={e.detail && e.detail.icon_url}
              />
            )}
          </li>
        ))}
      </TweenOne>
    </div>
  )
}

PlayGameBox.propTypes = {
  gunBgList: PropTypes.array,
  animateFinish: PropTypes.func,
  step: PropTypes.number,
};

export default PlayGameBox
