import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import img from '@utils/img'
import { observer, inject } from 'mobx-react'

function RedEnvelopeRules ({appStore}) {
  const {modalStore} = appStore
  const {redEnvelopeType, setRedEnvelopeType} = modalStore
  return (
    <div className='red-envelope-rules'>
      <div className='red-rules-title'>口令红包规则</div>
      <div className='red-rules-description'>
        <p>1.输入红包口令，可获得随机金币奖励，金币用于平台内所有活动。</p>
        <p>2.同一台设备或网络环境最多可以从 1 个红包中，获得 2 次奖励。</p>
        <p>3.口令可以通过官方QQ群和官方活动等方式获得，口令和红包有时效性。</p>
        <p>红包最终解释权归本平台所有，任何通过非法手段牟利都会导致资产冻结，或账号封禁。</p>
      </div>
      <div className='red-goback' onClick={() => {setRedEnvelopeType('receive')}}>
        <div className='goback-btn'> 返回红包封面</div>
      </div>
    </div>)
}
RedEnvelopeRules.propTypes = {
  appStore: PropTypes.any,

};

export default inject('appStore')(observer(RedEnvelopeRules));
