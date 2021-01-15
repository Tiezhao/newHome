import React, { useState, useEffect } from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'
import { Layout, Menu, Spin, Button, Card, message, Modal, Input} from 'antd';
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react';
import methods from '@utils/methods'
import dealErrCode from '@utils/dealErrCode'
import img from '@utils/img'

function Charge ({ appStore }) {

  const { isAuth,  walletStore, walletConfig, modalStore, refreshWalletInfo, teamStore} = appStore
  const { detailData, getDetail} = teamStore
  const {  setShowService} = modalStore
  const {
    payWayList,
    getChannelImg,
    getChannelName,
    getChargeData,
    setPayData,
    payData,
    chargeData,
    checkoutInviteCode,
    onRecharge,
    checkPayCard,

  } = walletStore
  const { loading } =  payData

  const [mode, setMode] = useState('')
  const [inviteLoad, setInviteLoad] = useState(false)
  const [invitecode, setInvitecode] = useState('')
  const [qcodeTip, setQcodeTip] = useState('')
  const [payload, setPayload] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [qrcode, setQrcode] = useState('')
  const [info, setInfo] = useState('')

  const currentChannel = payData.method ? payData.method
    : null
  const chargeDataAmountArr = chargeData.groups ? chargeData.groups
    : null
  const currentAmountArr = currentChannel && chargeDataAmountArr ? chargeDataAmountArr[currentChannel].fast_amounts : []

  if (detailData.sales_code) {
    setPayData('discount_code', detailData.sales_code)
  }

  useEffect(() => {
    if (isAuth) {
      getChargeData()
    }

  }, [isAuth]);
  const handleChangeChannel = (value) => {
    setPayData('method', value)
    setPayData('amount', 0)
  }

  const handleMoneyBtn = (info) => {
    setInfo(info)
    setPayData('amount', info.amount)
    setMode(info.mode)
    if (payData.method === 'card_password') {
      window.open(info.pay_url)
    }
  }

  const handleInviteCode = async () => {
    try {
      console.log('invitecode', invitecode);
      if (!invitecode) {
        return
      }
      setInviteLoad(true)
      const res = await checkoutInviteCode(invitecode)
      setInviteLoad(false)
      if (res && res.code === 0) {
        setPayData('discount_code', invitecode)
        message.success('绑定成功!')
        getDetail()
      } else {
        dealErrCode.dealInviteErrCode(res.code)
      }
    } catch (error) {
      setInviteLoad(false)
    }
  }

  const handlePlay = async (e) => {
    e.preventDefault()
    if (payData.method === 'card_password') {
      handleCardPlay()
    } else {
      handlePay()
    }
  }

  const handlePay = async () => {

    if (!isAuth) {
      message.error('你还没有登录')
    } else if (!payData.method) {
      message.error('请选择支付方式')
    } else if (!payData.amount) {
      message.error('请选择充值金额')
    } else {

      setPayload(true)

      let mywin
      if (mode !== 'SCAN_CODE' && mode !== 'SCAN_CODE_ONLY_WEB') {
        mywin = window.open();
        mywin.document.getElementsByTagName('body')[0].innerHTML = '<div>页面加载中，请稍等片刻.....</div>'
      }

      const res = await onRecharge()
      setPayload(false)
      if (res && res.code === 0) {
        if (res.data.order_info.payment_url) {
          mywin.location.href = res.data.order_info.payment_url
          setPayData('discount_code', '')
        } else if (res.data.order_info.qrcode_url) {
          setShowCodeModal(true)
          setQrcode(res.data.order_info.qrcode_url)

          if (payData.method === 'wechatpay_scan_qrcode') {

            setQcodeTip('请使用微信扫码付款')
          } else if (payData.method === 'alipay_scan_qrcode') {

            setQcodeTip('请使用支付宝扫码付款')
          }
        }
      } else {
        if (res) {
          dealErrCode.dealChargeErrCode(res.code)
        }
        if (mode !== 'SCAN_CODE') {
          mywin.close()
        }
      }
    }
  }
  const handleSerive = () => {
    setShowService(true)
  }
  const handleCardPlay = async () => {
    if (payData.cardNum.length < 12) {
      message.error('卡号格式错误')

    } else if (!isAuth) {
      message.error('你还没有登录')
    } else if (!payData.method) {
      message.error('请选择支付方式')
    } else if (!payData.amount) {
      message.error('请选择充值金额')
    } else {
      const params = {
        currency: 'USD',
        method: 'card_password',
        terminal: 'web',
        card_num: this.state.cardNum
      }
      setPayload(true)
      const res = await checkPayCard(params)
      setPayload(false)
      if (res && res.code === 0) {
        setPayData('discount_code', '')
        setPayData('cardNum', '')
        message.success('充值成功')
        refreshWalletInfo()
      } else {
        dealErrCode.dealCardPayErrCode(res.code)
      }
    }
  }
  const Nav = () => (
    <div className='charge-header'>
      <div>
        <p>请选择支付方式</p>
        <div className='charge-service'>充值未到账，投诉建议等请点此 <span onClick={handleSerive}>联系客服{'>'}</span></div>
      </div>
      <Menu
        mode='horizontal'
        selectedKeys={[payData.method]}
        style={{ height: '100%' }}
      >
        {
          payWayList.map((info, i) => (
            <Menu.Item
              key={info.key}
              onClick={() => {
                handleChangeChannel(info.key)
              }}
            >
              <div className='charge-pay-item'>
                <img className='charge-pay-icon' src={getChannelImg(info.key)} />
                <span>{getChannelName(info.key)}</span>
                {info.key === payData.method ? <img className='charge-select-icon' src={img.icon_zfdj} /> : null}
              </div>
            </Menu.Item>
          ))
        }
      </Menu>
    </div>
  )

  const Amounts = () => (
    <div className='charge-box'>
      <p>请选择充值额度</p>
      <div className='charge-amounts'>
        {
          currentAmountArr.map((info, i) => {
            const useTime = info.open_hours ? info.open_hours[0].start_hour + ':00~' + info.open_hours[0].end_hour + ':00' : ''
            return (
              <Button
                key={i}
                disabled={!info.available}
                className={info.amount === payData.amount ? 'charge-select-btn' : 'charge-unselect-btn'}
                onClick={() => {handleMoneyBtn(info)}}
              >
                <div>
                  {info.amount === payData.amount ? <img className='charge-select-icon' src={img.icon_zfdj} /> : null}
                  <p className={[info.amount >= 30000 ? 'charge-amounts-money-big' : 'charge-amounts-money']}>{`$ ${methods.MoneySlice(info.amount)}`}</p>
                  <p className={info.amount >= 30000 ? 'charge-amounts-use-big' : 'charge-amounts-use'}>{useTime}</p>
                  {info.preferential ? <p className={info.amount >= 30000 ? 'charge-amounts-use-big' : 'charge-amounts-use'}>{`赠送$${methods.MoneySlice(info.preferential)}`}</p> : null}
                </div>
              </Button>
            )
          })
        }
      </div>
    </div>
  )

  const ChargeModal = () => (
    <Modal
      className='charge-modal-layout'
      width={350}
      visible={showCodeModal}
      onCancel={() => {
        setShowCodeModal(false)
        setQrcode('')
      }}
      footer={null}
    >
      <div className='modal-layout'>
        <div className='modal-body'>
          {qrcode ? <QRCode value={qrcode} /> : null}
        </div>
        <div className='modal-footer'>
          <p>{qcodeTip}</p>
          <Button onClick={() => {
            setShowCodeModal(false)
            setQrcode('')
          }}
          >已完成支付
          </Button>
        </div>
      </div>
    </Modal>
  )


  const Invitecard  = () => (
    <Card className='charge-center-card'>
      <Spin spinning={inviteLoad}>
        <div className='charge-card-box'>
          {detailData.promoter_gift_pct <= 0 ? <div className='charge-card-left'>
            <p>推广码</p>
            <div className='charge-input-group'>
              <Input value={invitecode} autoFocus onChange={(val) => {
                setInvitecode(val.target.value)
              }} />
              <Button
                className='use-pay-btn'
                onClick={handleInviteCode}
              >使用
              </Button>
            </div>
          </div>
            : <div className='charge-card-left'>
              <p>推广码</p>
              <div className='charge-preferential'><p>{detailData.sales_code}</p></div>
              <div className='charge-preferential'><img src={img.icon_gou}/> <p>{`已激活,获得${detailData.promoter_gift_pct}%优惠`}</p></div>
            </div>}
        </div>
      </Spin>
    </Card>
  )

  const CardPwd = () => (
    <div className='card-odiv'>
      <div>
        <span>卡号</span>
        <input
          placeholder='请输入卡号'
          type='text'
          onChange={(e) => {
            setPayData('cardNum', e.target.value)

          }}
        />
      </div>
    </div>
  )
  const Content = () => (
    <div className='charge-body'>
      <Spin spinning={payload}>
        <Amounts />
        <Invitecard />
        {payData.method === 'card_password' ? <CardPwd /> : null}
      </Spin>
    </div>
  )


  const Footer = () => {
    const palyRmb = methods.MoneySlice(payData.amount * walletConfig.CNY_FIXED)

    return (
      <div className='charge-footer-box'>
        <div className='charge-footer-header'>
          <p className='charge-pay-text'>共获得<span className='charge-pay-money'>{` $ ${methods.MoneySlice(payData.amount)}`}</span></p>
          <p className='charge-pay-jb'>{`需支付$ ${methods.MoneySlice(payData.amount)} ≈ ¥ ${palyRmb}`}</p>
        </div>
        <div className='charge-footer-body'>
          <Button onClick={handlePlay}>{payData.method === 'card_password' ? '确定使用' : '确定支付'}</Button>
        </div>
      </div>
    )
  }

  return (
    <Spin spinning={loading}>
      <div className='charge-layout'>
        <Layout >
          <Nav />
          <Content />
          <Footer />
          <ChargeModal />
        </Layout>
      </div>
    </Spin>
  );
}
Charge.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(Charge));
