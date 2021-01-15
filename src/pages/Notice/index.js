import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import './index.less'
import img from '@utils/img'
import TextLoop from 'react-text-loop';


function Notice ({ appStore }) {
  const { noticeStore } = appStore
  const { getNoticeData, noticeData } = noticeStore


  useEffect(() => {
    getNoticeData()
  }, [])
  console.log('noticeData', toJS(noticeData));
  return (
    <div className='notice-layout'>
      <div className='notice-box'>
        <img src={img.icon_gglb} className='notice-icon' />
        {noticeData.list.length > 0 ?  <TextLoop>
          {noticeData.list.map((item, i) => (
            <div className='notice-info' key={i}>
              <div >{item.title}{':'}</div>
              <div>{item.content}</div>
            </div>
          ))}
        </TextLoop> : null}
      </div>
    </div>
  )
}
Notice.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(Notice));


