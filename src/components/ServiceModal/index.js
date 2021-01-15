
import React, { useState, useEffect, useRef} from 'react'
import './index.less'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { useHistory } from 'react-router-dom';
import {Modal, message} from 'antd';
import copy from 'copy-to-clipboard';
import config from '@configs/config'
function ServiceModal ({ appStore}) {
  const {modalStore} = appStore
  const {showService, setShowService } = modalStore
  const qqCode = config.qq()
  const handleCopy = (value) => {
    if (copy(value)) {
      message.success('复制成功')
    } else {
      message.error('复制失败')
    }
  }
  return (
    <div>
      <Modal
        className='servicemodal-box'
        width={400}
        visible={showService}
        onCancel={() => {setShowService(false)}}
        centered
        footer={null}
      >
        <div className='service-qq'>
          <span>官方客服QQ群:</span>
          <span className='qq-color'>{qqCode}</span>
        </div>
        <div onClick={() => {handleCopy(qqCode)}} className='qq-code'>
          <div>复制QQ号</div>
        </div>
      </Modal>
    </div>
  );
}
ServiceModal.propTypes = {
  appStore: PropTypes.any,

};

export default inject('appStore')(observer(ServiceModal));

