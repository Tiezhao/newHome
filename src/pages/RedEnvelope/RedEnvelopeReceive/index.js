import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { observer, inject } from 'mobx-react'
import { Button, Form, Input, message } from 'antd'
import { toJS } from 'mobx'

function RedEnvelopeReceive ({ appStore}) {
  const { activityStore, modalStore, isAuth, refreshWalletInfo} = appStore
  const {redEnvelopeType, setRedEnvelopeType} = modalStore
  const {getActivityUserJoin, loadingShow, setLoadingShow, changeUpper} = activityStore
  const [form] = Form.useForm();
  const handleReceive = async (obj) => {
    setLoadingShow(true)
    if (obj.join_key && obj.join_key != '') {
      const res = await getActivityUserJoin(obj)
      if (res.code === 0) {
        refreshWalletInfo()
        setRedEnvelopeType('info')
        setLoadingShow(false)
      } else if (res.code === 1434) {
        message.error('同一台设备最多可以领3次奖励。')
        setLoadingShow(false)
      } else if (res.code === 1435) {
        message.error('您的充值数额不足$' + res.data.recharge_min / 100  + ',暂不能打开')
        setLoadingShow(false)

      } else {
        message.error('口令有误或红包已过期')
        setLoadingShow(false)
      }
    } else {
      message.error('口令不能为空')
      setLoadingShow(false)
    }
  }
  const onFinish = (value)  => {
    if (isAuth) {
      const obj = {
        type_id: 'ffffffffffffff8250aa1001',
        join_key: value.join_key
      }
      handleReceive(obj)
    } else {
      message.error('请您登录后再尝试')
    }
  }
  const  handleFailed = () => {
    form.validateFields()
    message.error('口令不能为空')
  }
  return (
    <div className='red-envelope-receive'>
      <div className='good-luck'>祝您鸿运当头</div>
      <div className='join-qq'>加入QQ群获取更多红包</div>
      <Form
        onFinish={onFinish}
        onFinishFailed={handleFailed}
        form={form} >
        <Form.Item
          name="join_key"
        >
          <Input placeholder='输入口令领取红包' className='join-key-input' autoComplete="off" />
        </Form.Item>
        <Button loading={loadingShow} htmlType="submit" className='righr-btn'>确认</Button>
      </Form>
      <div className='envelope-rules-link'>
        <div className='rules-link' onClick={() => {setRedEnvelopeType('rules')}}>口令红包规则</div>
      </div>
    </div>)
}
RedEnvelopeReceive.propTypes = {
  appStore: PropTypes.any,
};

export default inject('appStore')(observer(RedEnvelopeReceive));
