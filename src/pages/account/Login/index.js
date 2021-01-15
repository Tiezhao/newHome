import React, { useState, useEffect, useRef } from 'react'
import '../index.less'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import methods from '@utils/methods'
import { useHistory } from 'react-router-dom';
import img from '@utils/img'
import { useInvitation } from '@hooks/useInvitation'
import storage from '@utils/storage'
import dealErrCode from '@utils/dealErrCode'
import { Button, Col, Form, Input, Layout, Row, Spin } from 'antd'
import api from '@configs/api'
import { ecauth } from '@configs/storageKey'
function Login ({ appStore }) {
  let history = useHistory()
  const {  setAuth,  socketStore, login, getUserInfoAndWalletInfo, setLoginInfo, modalStore} = appStore
  const { setShowAuth, setAuthType} = modalStore
  const [loading, setLoading] = useState(false);
  const myreg = methods.testEmail()
  const [form] = Form.useForm();


  const checkPhoneNub = (rule, value, callback) => {
    if (myreg.test(value)) {
      return Promise.resolve();
    } else {
      const errText = '请输入正确邮箱地址！'
      return Promise.reject(errText);
    }
  }

  const  handleFailed = ({ values, errorFields, outOfDate }) => {
    form.validateFields()
  }

  const onFinish = (values)  => {
    const obj = {
      email: values.email,
      password: values.password,
      device_info: {
        client_id: 'ffffffffffffffff',
        system: 'Android',
        system_version: '10',
        pusher_id: 'fffffffffffffffffff'
      }
    }
    handleLogin(obj)
  }

  const  handleLogin = async (obj) => {
    setLoading(true)
    const res = await login(obj)
    setLoading(false)
    if (res) {
      if (res.code === 0) {
        const bearertToken = res.data.type + ' ' + res.data.token
        const token = res.data.token
        const refreshToken = res.data.refresh_token
        storage.set(ecauth.token, token)
        storage.set(ecauth.bToken, bearertToken)
        storage.set(ecauth.rToken, refreshToken)
        setAuth(true)
        getUserInfoAndWalletInfo()
        setLoginInfo(res.data)
        setShowAuth(false)
        socketStore.login()
      } else {
        dealErrCode.dealUserErrCode(res.code)
      }
    }
  }

  const handleForget = () => {
    setAuthType('forget')
  }

  const handleReg = () => {
    setAuthType('reg')
  }
  const url = window.location.href
  const [referrer] = useInvitation(url);
  const handleSteamLogin = () => {
    if (referrer) {
      window.location.href = `${api.user.steam}?invite_id=${referrer}`
    } else {
      window.location.href = api.user.steam()
    }
  }

  const Body = () => (
    <Layout.Content>
      <Spin spinning={loading}>
        <Form
          onFinish={onFinish}
          onFinishFailed={handleFailed}
          form={form} >
          <Row
            type='flex'
            justify='center'
          >
            <Col span={24}>
              <Form.Item
                name="email"
                rules={[{ required: true, validator: checkPhoneNub }]}
              >
                <Input placeholder='请输入邮箱地址' />
              </Form.Item>
            </Col>
          </Row>
          <Row
            type='flex'
            justify='center'
          >
            <Col span={24}>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码!' },
                  {
                    min: 6,
                    message: '密码不能少于6个字符'
                  }
                ]}
              >
                <Input
                  type='password'
                  placeholder='请输入密码'
                />
              </Form.Item>
            </Col>
          </Row>
          <Row
            type='flex'
            justify='end'
          >
            <Col>
              <a onClick={handleForget} className='login-forget-title'>忘记密码?</a>
            </Col>
          </Row>
          <Row
            type='flex'
            justify='center'
            className='login-content'
          >
            <Button htmlType="submit">登录</Button>
          </Row>
          <Row
            type='flex'
            justify='center'
            className='login-reg-content'
          >
            <Button onClick={handleReg}>注册</Button>
          </Row>
        </Form>
      </Spin>
    </Layout.Content>
  )

  const Header = () => (
    <div className='auth-layout-header'>
      <p>登录</p>
    </div>

  )

  const Footer = () => (
    <div className='auth-footer'>
      <div className='auth-footer-top'>
        <div className='auth-footer-line' />
        <p>快捷登录</p>
        <div className='auth-footer-line' />
      </div>
      <Button onClick={handleSteamLogin}>
        <img src={img.icon_dlsteam} />
          Steam
      </Button>
    </div>
  )


  return (
    <Layout className='auth-layout'>
      <Header />
      <Body />
      <Footer />
    </Layout>
  );
}
Login.propTypes = {
  appStore: PropTypes.any,
};

export default inject('appStore')(observer(Login));
