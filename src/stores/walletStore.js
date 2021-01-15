
import api from '@configs/api'
import service from '@service'
import img from '@utils/img'
import methods from '@utils/methods'
import { message } from 'antd'
import { action, autorun, observable, toJS } from 'mobx'
import appStore from './appStore'

class WalletStore {
  constructor (appStore) {
    this.appStore = appStore
    autorun(() => {
      if (!this.appStore.isAuth) {
        this.initData()
      }

    })
  }

  @observable chargeData = {}

  @observable chargereq = {}


  @observable payWayList = []
  @observable payData = {
    currency: 'USD',
    // currency: 'CNY',
    amount: 0,
    method: '',
    terminal: 'web',
    discount_code: '',
    loading: false,
    cardNum: '',
  }


  @action initData = () => {
    this.chargeData = {}
    this.payWayList = []
    this.payData = {
      currency: 'USD',
      // currency: 'CNY',
      amount: 0,
      method: '',
      terminal: 'web',
      discount_code: '',
      loading: false,
    }
  }


  @action dynamic = (data) => {
    try {
      if (methods.checkNullObj(data)) {
        const min = data.min / 100
        const max = data.max / 100
        let amount = Math.round((Math.random() * (max - min) + min) * 10) / 10
        amount = methods.MoneySlice(amount, true)
        return amount
      }
    } catch (error) {
      console.log('err', error)
    }
  }

  @action setPayList = (value) => {
    this.payWayList = value
  }

  @action setPayData = (key, value) => {
    this.payData[key] = value
  }

  @observable walletInfo = {}

  @action getChannelName = (name) => {
    switch (name) {
    case 'alipay_wap':
      return '支付宝'
    case 'wechatpay_scan_qrcode':
      return '微信'
    case 'alipay_scan_qrcode':
      return '支付宝'
    case 'bankcard':
      return '网银转账'
    case 'ali_to_bank':
      return '支付宝转账'
    case 'scan_qrcode':
      return '扫码支付'
    case 'alipay_pc':
      return '支付宝'
    case 'card_password':
      return '充值卡'
    default:
      return name
    }
  }

  @action getChannelImg = (name) => {
    switch (name) {
    case 'alipay_wap':
      return img.icon_zfb
    case 'alipay_scan_qrcode':
      return img.icon_zfb
    case 'alipay_pc':
      return img.icon_zfb
    case 'wechatpay_scan_qrcode':
      return img.icon_wx
    case 'bankcard':
      return img.icon_zfb
    case 'ali_to_bank':
      return img.icon_zfb
    case 'scan_qrcode':
      return img.icon_zfb
    case 'card_password':
      return img.icon_czk
    default:
      return img.icon_zfb
    }
  }

  @action dealChargeObj = (channelList) => {
    try {
      let obj = {}
      for (let i = 0; i < channelList.length; i++) {
        const item = channelList[i]
        obj[item.payer_id] = toJS(item)
      }
      return obj
    } catch (error) {
      console.log('err', error)
    }
  }

  @action getChargeData = async () => {
    try {
      const params = {
        currency: 'USD',
        terminal: 'web'
      }
      this.payData.loading = true
      const res = await service.request(api.pay.rechangeState(), 'GET', params)
      this.payData.loading = false
      if (res && res.code === 0) {
        Object.keys(res.data.groups).map(async (info, i) => {
          const chargereq = await service.request(api.task.getCharge(info), 'GET', null, { load: false })
          console.log('chargereq', chargereq)
          if (chargereq.code === 0) {
            this.chargereq = chargereq.data
            for (let i = 0; i < res.data.groups[info].fast_amounts.length; i++) {
              const famount = res.data.groups[info].fast_amounts[i].amount;
              if (chargereq.data && chargereq.data[famount]) {
                res.data.groups[info].fast_amounts[i].preferential = chargereq.data[famount]
              }
            }

          }

          this.chargeData = res.data
        })

        let payWayList = []
        Object.keys(res.data.groups).map((info, i) => {
          let obj = {
            key: info,
            data: res.data.groups[info]
          }
          payWayList.push(obj)
        })

        this.payWayList = payWayList
        this.setPayData('method', payWayList[0].key)
      }
    } catch (error) {
      console.log('error', error)
      this.payData.loading = false
    }
  }

  @action checkoutInviteCode = async (_id) => {
    const res = await service.request(api.wallet.checkInviteCode(_id), 'GET')
    return res
  }

  @action selectChannelsWay = () => {
    try {
      let currentData = {}
      switch (this.payData.method) {
      case 'alipay_wap':
        currentData = this.chargeData.groups.alipay_wap
        break
      case 'alipay_scan_qrcode':
        currentData = this.chargeData.groups.alipay_scan_qrcode
        break
      case 'wechatpay_scan_qrcode':
        currentData = this.chargeData.groups.wechatpay_scan_qrcode
        break
      case 'alipay_pc':
        currentData = this.chargeData.groups.alipay_pc
        break
      case 'bankcard':
        currentData = this.chargeData.groups.bankcard
        break
      case 'ali_to_bank':
        currentData = this.chargeData.groups.ali_to_bank
        break
      case 'scan_qrcode':
        currentData = this.chargeData.groups.scan_qrcode
        break
      default:
        break
      }
      const params = {}

      if (this.payData.amount >= currentData.min_amount && this.payData.amount <= currentData.max_amount) {
        params.amount = this.payData.amount
        params.discount_code = this.payData.discount_code
        params.currency = this.payData.currency
        params.method = this.payData.method
        params.terminal = this.payData.terminal
      } else {
        console.log('currentData', toJS(currentData));
        message.error(`最小充值金额${methods.MoneySlice(currentData.min_amount.amount)}元，最大充值金额${methods.MoneySlice(currentData.max_amount.amount)}元`)
        console.log('不支持该金额！');
      }
      return params
    } catch (error) {
      console.log('err', error)
    }
  }

  @action onRecharge = async () => {
    try {
      if (this.payData.method === 'alipay_wap' || this.payData.method === 'wechatpay_scan_qrcode' || this.payData.method === 'alipay_scan_qrcode') {
        const params = this.selectChannelsWay()

        if (!methods.checkNullObj(params)) {
          return
        }
        const data = {
          key: 11
        }
        const lockInfo = await appStore.tokenLock(data)
        if (lockInfo && lockInfo.code === 0) {
          const option = {
            lockToken: lockInfo.data.token
          }
          const res = service.request(api.pay.recharge(), 'POST', params, option)
          return res
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  @action checkPayCard = async (params) => {
    if (this.payData.discount_code.length > 0) {
      params.discount_code = this.payData.discount_code
    }

    const res = await service.request(api.pay.pointCardRecharge(), 'POST', params)
    return res
  }
}


export default WalletStore
