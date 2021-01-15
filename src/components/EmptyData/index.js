import React, { useState, useEffect, useRef} from 'react'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import img from '@utils/img'
import './index.less'

function EmptyData ({ appStore }) {
  return (
    <div className='empty-layout'>
      <p>暂无数据</p>
      <img src={img.icon_kzt}/>
    </div>
  );
}
EmptyData.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(EmptyData));
