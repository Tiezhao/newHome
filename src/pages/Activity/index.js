import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import './index.less'
import img from '@utils/img'
import { useHistory } from 'react-router-dom';

function Activity ({ appStore }) {
  useEffect(() => {
  }, [])
  let history = useHistory()
  return (
    <div className='activity-layout'>
      <img src={img.actbg} className='activity-img'/>
      <div className='activity-button' onClick={() => {history.push('/home/boxhome')}}>进入首页</div>
    </div>
  )
}
Activity.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(Activity));


