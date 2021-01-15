
import React, { Component } from 'react'
import '../index.less'
import { Button, Col, Form, Input, Layout, Row, Spin, Radio, message } from 'antd'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import methods from '@utils/methods'
import { useHistory } from 'react-router-dom';
import storage from '@utils/storage'
import { ecauth } from '@configs/storageKey'
import dealErrCode from '@utils/dealErrCode'
const myreg = methods.testEmail()

@inject('appStore') @observer class Forget extends Component {
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
      callback()
    } else {
      const errText = '请输入正确邮箱地址！'
      callback(errText)
    }
  }


  _renderHeader = () => (
    <div className='auth-layout-header'>
      <p>找回密码</p>
    </div>

  )

  onFinish = (values) => {
    const parmas = {
      email: values.username,
      password: values.password,
      valid_code: values.code
    }
    this.forget(parmas)
  }

  forget = async (parmas) => {

    const {appStore, } = this.props
    const {register, modalStore} = appStore
    const { setShowAuth } = modalStore
    this.setState({
      loading: true
    })

    const res = await register(parmas, 2)
    this.setState({
      loading: false
    })
    if (res) {
      if (res.code === 0) {
        setShowAuth(false)
        message.success('修改成功，请登录!')
        this.form.resetFields()
        this.stopCountDown()
      } else {
        dealErrCode.dealUserErrCode(res.code)
      }
    }
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
    const res = await getCode(2, username)
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


  handleFailed = () => {
    this.form.validateFields()
  }


  _renderBody = () => {
    const { countdown, loading} = this.state
    const codeText = countdown === 0 ? '获取验证码' : `${countdown}秒后重发`
    const lock = countdown > 0
    return (
      <Layout.Content>
        <Spin spinning={loading}>
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
                      <Button disabled={lock} onClick={this.handleSendCode}>
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
              className='login-content'
            >
              <Button htmlType='submit'>重置</Button>
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
Forget.propTypes = {
  appStore: PropTypes.any,
};


export default Forget
