
import React, { useState, useEffect, useRef} from 'react'
import './index.less'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { useHistory } from 'react-router-dom';
import {Modal, message} from 'antd';


function LimitModal ({ appStore, centerStore}) {
  const {modalStore} = appStore
  const {showLimit, setShowLimit} = modalStore
  const { setCenterType} = centerStore
  const history = useHistory()
  const handleJumpCharge = () => {
    history.push('/home/center/charge')
    setCenterType('charge')
    setShowLimit(false)
  }
  return (
    <Modal
      className='limit-modal-box'
      width={400}
      visible={showLimit}
      onCancel={() => {setShowLimit(false)}}
      centered
      footer={null}
    >
      <div className='limit-info'>
        <div className='limit-charge'>充值任意金额，即可开启取回权限</div>
        <div className='charge-btn'>
          <div onClick={handleJumpCharge}>立即充值</div>
        </div>
      </div>
    </Modal>

  );
}
LimitModal.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore', 'centerStore')(observer(LimitModal));

