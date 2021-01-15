
class Config {
  qq = () => 471033240
  timeOut = () => 10000
  baseUrl = () => process.env.REACT_APP_EC_BASEAPI
  // 用户接口
  passportUrl= () => process.env.REACT_APP_EC_PASSPORTAPI
  // 钱包接口
  walletUrl= () => process.env.REACT_APP_EC_WALLETAPI
  // 推广接口
  promotionUrl= () => process.env.REACT_APP_EC_PROMOTIONAPI
  // 公告接口
  noticeUrl= () => process.env.REACT_APP_EC_NOTICEAPI
  // 大奖池接口
  poolUrl = () => process.env.REACT_APP_EC_POOLAPI
  // 系统配置接口
  configUrl= () => process.env.REACT_APP_EC_CONFIG
  // 箱子后台接口
  boxUrl= () => process.env.REACT_APP_EC_BOX
  //  取回后台接口
  retrieveUrl=() => process.env.REACT_APP_EC_BOX
  csgoUrl = () => process.env.REACT_APP_CSGOAPI
  // 活动
  taskUrl = () => process.env.REACT_APP_TASK
  diceUrl = () => process.env.REACT_APP_DICE
  doubleUrl = () => process.env.REACT_APP_DOUBOLE
  jackUrl = () => process.env.REACT_APP_JACK
  jackPackageUrl = () => process.env.REACT_APP_JACK_PACKAGE
  sockClentUrl = () => process.env.REACT_APP_SOCKET
  sockIoUrl = () => process.env.REACT_APP_SOCKETIO
}

export default new Config()
