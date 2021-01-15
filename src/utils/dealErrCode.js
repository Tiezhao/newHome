
import { message } from 'antd'
import history from '@router/history'
class DealErrCode {

  /** 处理用户模块错误信息
   *
   * @param {错误码} code
   */
  dealUserErrCode = (code) => {
    switch (code) {
    case 403:
      message.error('当前未开放注册')
      break
    case 1011:
      message.error('用户不存在!')
      break
    case 12:
      message.error('用户不存在!')
      break
    case 1012:
      message.error('您的账户被禁用,请联系客服!')
      break
    case 1013:
      message.error('账户密码错误')
      break
    case 1020:
      message.error('用户不存在')
      break
    case 1021:
      message.error('该手机已被注册')
      break
    case 1022:
      message.error('该邮箱已被注册')
      break

    case 1023:
      message.error('邀请码错误')
      break
    case 1024:
      message.error('邀请码失效')
      break
    case 1025:
      message.error('邀请码不能为空')
      break
    case 5001:
      message.error('验证码过期')
      break
    case 5000:
      message.error('验证码错误')
      break
    case 5002:
      message.error('上一个验证码未过期')
      break
    case 5003:
      message.error('验证码已发送，请稍后再试!')
      break
    case 5600:
      message.error('验证码服务暂时无法使用')
      break
    case 1026:
      message.error('不支持该邮箱，请使用QQ邮箱等邮箱地址')
      break
    default:
      message.error('网络错误')
      break
    }
  }

  /** 处理活动模块错误码
   *
   * @param {错误码} code
   */
  dealActivityErrCode = (code) => {
    switch (code) {
    case 1400:
      message.error('该活动不存在!')
      break
    case 1401:
      message.error('未满足最高充值金额限')
      break
    case 1412:
      message.error('未满足最高充值金额限')
      break
    case 1421:
      message.error('已经参加过活动')
      break
    case 1422:
      message.error('活动仅能参与一次')
      break
    case 1423:
      message.error('活动今天已经参加')
      break
    case 1424:
      message.error('不在活动名单')
      break
    case 1425:
      message.error('今日已领取')
      break
    case 1426:
      message.error('不满足领取条件')
      break
    default:
      message.error('网络错误')
      break
    }
  }

  // 处理充值错误
  dealChargeErrCode = (code) => {
    switch (code) {
    case 1255:
      message.error('该充值额度维护中')
      break
    case 1234:
      message.error('该额度充值时间9:00～22:00，请选择其他额度')
      break
    default:
      message.error('网络错误')
      break
    }
  }

  // 处理优惠码错误
  dealInviteErrCode = (code) => {
    switch (code) {
    case 12:
      message.error('找不到该优惠码或该优惠码无效!')
      break
    case 1235:
      message.error('该优惠码无效或已使用!')
      break
    case 11:
      message.error('该优惠码已使用!')
      break
    case 31:
      message.error('该优惠码已使用!')
      break
    default:
      message.error('网络错误')
      break
    }
  }

  // 处理充值卡错误
 dealCardPayErrCode = (code) => {
   switch (code) {
   case 422:
     message.error('卡号格式错误')
     break
   case 12:
     message.error('充值码不存在')
     break
   case 13:
     message.error('充值码已被使用')
     break
   default:
     message.error('网络错误')
     break
   }
 }

  dealBoxErrCode = (code) => {
    switch (code) {
    case 13, 14:
      message.error('该箱子已下架，请更换其他箱子')
      break
    case 12:
      message.error('该箱子不存在，请更换其他箱子')
      break
    case 2461:
      message.error('余额不足，请充值')
      break
    case 2412:
      message.error('箱子维护中，请更换其他箱子')
      break
    default:
      message.error('网络错误')
      break
    }
  }

  // 处理steam
  dealSteamErrCode = (code) => {
    switch (code) {
    case 12:
      message.error('用户不存在')
      break
    case 13:
      message.error('用户被禁用')
      break
    case 14:
      message.error('更新用户信息失败')
      break
    case 26:
      message.error('更新用户信息成功')
      break
    case 422:
      message.error('此链接无效')
      break
    default:
      message.error('网络错误')
      break
    }
  }
  // 处理roll房
  dealRollErrCode = (code) => {
    switch (code) {
    case 1400:
      message.error('该roll房不存在')
      break
    case 1421:
      message.error('已加入过该roll房，请不要重复加入')
      break
    case 1436:
      message.error('该roll房还未开始')
      break
    case 1437:
      message.error('该roll房已结束')
      break
    case 1438:
      message.error('密码错误，请您重新输入')
      break
    default:
      message.error('网络错误')
      break
    }
  }
}
export default new DealErrCode()
