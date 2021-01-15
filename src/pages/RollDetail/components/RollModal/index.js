import './index.less'
import img from '@utils/img'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import {message, Modal, Form, Input, Button} from 'antd';
import React, { useState, useEffect } from 'react'
import dealErrCode from '@utils/dealErrCode'
import { toJS } from 'mobx';


function RollModal ({ appStore, centerStore}) {
  const {activityStore} = appStore
  const {setCenterType} = centerStore
  const {showRoll, setShowRoll, activity_id, btnLoad, setBtnLoad, getActivityUserJoin, limitType, setLimitType, getRollDetail} = activityStore

  const [form] = Form.useForm();
  const history = useHistory()
  const onFinish = (value)  => {
    const obj = {
      activity_id: activity_id,
      join_key: value.join_key
    }
    handleJoin(obj)
  }
  const handleJoin = async (obj) => {
    setBtnLoad(true)
    if (obj.join_key && obj.join_key != '') {
      const res = await getActivityUserJoin(obj)
      if (res.code == 0) {
        setBtnLoad(false)
        setShowRoll(false)
        message.success('加入roll房成功')
        getRollDetail(activity_id)
      } else if (res.code == 1435) {
        message.error('未满足roll房充值门槛')
        setLimitType(false)
        setBtnLoad(false)
      } else  {
        dealErrCode.dealRollErrCode(res.code)
        setBtnLoad(false)
      }
    } else {
      message.error('密码不能为空')
      setBtnLoad(false)
    }
  }
  const  handleFailed = () => {
    form.validateFields()
    message.error('口令不能为空')
  }
  const handleJumpCharge = () => {
    history.push('/home/center/charge')
    setCenterType('charge')
    setShowRoll(false)
  }
  // 做门槛判断才可以返回对应的
  const CodeLimit = () => (
    <Form
      onFinish={onFinish}
      onFinishFailed={handleFailed}
      form={form} >
      <Form.Item
        name="join_key"
        label='请输入密码'
      >
        <Input className='code-input' autoComplete="off"/>
      </Form.Item>
      <Button  htmlType="submit" className='join-btn' loading={btnLoad}>参加</Button>
    </Form>
  )
  const ChargeLimit = () => (
    <div className='roll-charge-style'>
      <div>roll房开启期间充值累计达到$10即可</div>
      <div className='charge-btn' onClick={() => {handleJumpCharge()}}>前往充值</div>
    </div>
  )
  const  RollModalContent = () => (
    <div className='roll-modal-mini'>
      <div className='roll-modal-title'>{limitType ? '参加密码房' : '参加roll房'}</div>
      <div className='roll-modal-body'>
        {limitType ? <CodeLimit/> : <ChargeLimit/>}
      </div>
    </div>
  )
  return (
    <Modal
      className='roll-modal-box'
      width={400}
      visible={showRoll}
      onCancel={() => {setShowRoll(false), setLimitType(true)}}
      centered
      footer={null}
    >
      <RollModalContent/>
    </Modal>
  )
}

RollModal.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};
export default inject('appStore', 'centerStore')(observer(RollModal));
