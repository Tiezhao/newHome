import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import './index.less'
import img from '@utils/img'


function Banner ({ appStore }) {
  useEffect(() => {
  }, [])
  const handleJump = () => {
    const w = window.open('about:blank');
    w.location.href = '/auth/activity'

  }
  return (
    <div className='banner-layout'>
      <div onClick={() => {handleJump()}} className='banner-activity'><img src={img.banner}/></div>
      <div><img src={img.banner1}/></div>
    </div>
  )
}
Banner.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(Banner));


