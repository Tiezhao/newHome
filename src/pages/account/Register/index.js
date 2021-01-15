
import React, { Component } from 'react'
import '../index.less'
import { Button, Col, Form, Input, Layout, Row, Spin, Radio, message} from 'antd'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import methods from '@utils/methods'
import history from '@router/history'
import storage from '@utils/storage'
import { ecauth } from '@configs/storageKey'
import dealErrCode from '@utils/dealErrCode'
const myreg = methods.testEmail()

@inject('appStore') @observer class Register extends Component {

  constructor (props) {
    super(props)
    this.handleSendCode = this.handleSendCode.bind(this)
    this.stopCountDown = this.stopCountDown.bind(this)
    this.state = {
      loading: false,
      countdown: 0,
      check: false,
    }
  }

 checkPhoneNub = (rule, value, callback) => {
   if (myreg.test(value)) {
     return Promise.resolve();
   } else {
     const errText = '请输入正确邮箱地址！'
     return Promise.reject(errText);
   }
 }
  checkNickName = (rule, value, callback) => {
    const errText = '昵称必须输入3～16个字符'
    const nameRule = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    if (!value) {
      return Promise.reject(errText);
    } else if (nameRule.test(value) && value.length >= 3 && value.length <= 16) {
      return Promise.resolve();
    } else {

      return Promise.reject(errText);
    }
  }
  checkReferrer = (rule, value, callback) => {
    if (!value) {
      return Promise.resolve();
    } else {
      value = value.toUpperCase()
      const nameRule = /^[A-Z\d]+$/
      if (nameRule.test(value) && value.length === 6) {
        return Promise.resolve();
      } else {
        const errText = '请输入6位大写字母加数字邀请码'
        return Promise.reject(errText);
      }
    }
  }
  onFinish = async (values) => {
    const {check} = this.state
    if (!check) {
      message.info('请同意《隐私协议》')
      return
    }

    let referrer = ''
    if (values.referrer) {
      referrer = values.referrer.toUpperCase()
    }
    const ref = await storage.get('douinvitecode')
    if (ref) {
      referrer = ref.toUpperCase()
    }
    console.log('referrer', referrer);
    let parmas = {}
    if (referrer && referrer !== null) {
      parmas = {
        email: values.username,
        password: values.password,
        valid_code: values.code,
        nickname: values.nickname,
        origin: '1',
        channel: '1',
        referrer: referrer
      }
    } else {
      parmas = {
        email: values.username,
        password: values.password,
        valid_code: values.code,
        nickname: values.nickname,
        origin: '1',
        channel: '1',
      }
    }
    console.log('parmas', parmas);

    this.handleRegister(parmas)
  }

  handleRegister = async (parmas) => {
    const {appStore} = this.props
    const {register, getUserInfoAndWalletInfo, setAuth, setLoginInfo, socketStore, modalStore} = appStore
    const { setShowAuth } = modalStore
    this.setState({
      loading: true
    })

    const res = await register(parmas, 1)
    this.setState({
      loading: false
    })
    if (res) {
      if (res.code === 0) {
        this.form.resetFields()
        this.stopCountDown()
        this.setState({
          check: false
        })
        const bearertToken = res.data.type + ' ' + res.data.token
        const token = res.data.token
        const refreshToken = res.data.refresh_token
        storage.set(ecauth.token, token)
        storage.set(ecauth.bToken, bearertToken)
        storage.set(ecauth.rToken, refreshToken)
        getUserInfoAndWalletInfo()
        setAuth(true)
        setLoginInfo(res.data)
        setShowAuth(false)
        socketStore.login()
      } else {
        dealErrCode.dealUserErrCode(res.code)
      }
    }
  }

  handleFailed = () => {
    this.form.validateFields()
  }


  stopCountDown () {
    this.setState({ countdown: 0 })
    clearInterval(this.interval)
  }


  handleSendCode = (e) => {

    e.preventDefault()

    this.form.validateFields(['username']).then((value) => {
      console.log('value11', value);
      this.setState({
        countdown: 60
      }, () => {
        this.interval = setInterval(() => {
          if (this.state.countdown <= 0) {
            this.stopCountDown()
          } else {
            this.setState(({ countdown }) => ({ countdown: countdown - 1 }))
          }
        }, 1000)
      })
      this.getRisterCode(value.username)
    })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
        this.handleFailed()
      });


  }

  getRisterCode = async (username) => {
    const {appStore} = this.props
    const {getCode}  = appStore
    const { setFieldsValue } = this.form
    const res = await getCode(1, username)
    if (res) {
      if (res.code === 0) {
        if (res.data.code) {
          this.stopCountDown()
          setFieldsValue({ code: res.data.code })
        }
      } else {
        this.stopCountDown()
        dealErrCode.dealUserErrCode(res.code)
      }
    }
  }

  handleTextClick = () => {
    const w = window.open('about:blank');
    w.location.href = '/auth/privacy'

  }

  _renderHeader = () => (
    <div className='auth-layout-header'>
      <p>注册</p>
    </div>
  )

  _renderBody = () => {
    const { countdown} = this.state
    const codeText = countdown === 0 ? '获取验证码' : `${countdown}秒后重发`
    const lock = countdown > 0
    return (
      <Layout.Content>
        <Spin spinning={this.state.loading}>
          <Form
            onFinish={this.onFinish}
            onFinishFailed={this.handleFailed}
            ref={(even) => this.form = even} >

            <Row
              type='flex'
              justify='center'
            >
              <Col span={24}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, validator: this.checkPhoneNub }]}
                >
                  <Input placeholder='请输入邮箱地址' />
                </Form.Item>
              </Col>
            </Row>
            <Row
              type='flex'
              justify='space-between'
            >

              <Col span={24}>
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: '请输入验证码!' },
                    {
                      min: 6,
                      message: '请输入6位验证码'
                    }
                  ]}
                >
                  <Input
                    addonAfter={
                      <Button onClick={this.handleSendCode}  disabled={lock}>
                        {codeText}
                      </Button>
                    }
                    placeholder='验证码'
                  />
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
                  rules={[{ required: true, message: '请输入密码' },
                    {
                      min: 6,
                      message: '密码不能少于6个字符'
                    }, {
                      max: 32,
                      message: '密码不能超过32个字符'
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
              justify='center'
            >
              <Col span={24}>
                <Form.Item
                  name="nickname"
                  rules={[{ required: true, validator: this.checkNickName}]}
                >
                  <Input   placeholder='用户昵称(可更改)'/>
                </Form.Item>
              </Col>
            </Row>
            <Row
              type='flex'
              justify='center'
            >
              <Col span={24}>
                <Form.Item
                  name="referrer"
                  rules={[{ required: true, validator: this.checkReferrer}]}
                >
                  <Input  placeholder='请输入推广码（非必填）'/>
                </Form.Item>
              </Col>
            </Row>
            <Row
              className='login-agree-content'
            >
              <Col span={24}>
                <div className='login-agree-body'>
                  <Radio
                    checked={this.state.check} onClick={() => {

                      this.setState({
                        check: !this.state.check
                      })
                    }}
                  />
                  <div className='text'>
                    <span>我已详细阅读并同意</span>
                    <a onClick={() => this.handleTextClick('pivacy')}>《隐私协议》</a>
                  </div>
                </div>
              </Col>
            </Row>
            <Row
              type='flex'
              justify='center'
              className='login-content'
            >
              <Button htmlType='submit'>注册</Button>
            </Row>
          </Form>
        </Spin>
      </Layout.Content>
    )
  }

  render () {
    return (
      <Layout className='auth-layout'>
        {this._renderHeader()}
        {this._renderBody()}
      </Layout>
    );

  }

}
Register.propTypes = {
  appStore: PropTypes.any,
};


export default Register
