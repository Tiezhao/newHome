import config from './config'

const API = {

  // ----------------------------------passportUrl-------------------------------------------------
  // 用户相关
  user: {
    login: (np) => config.passportUrl() + '/home/v1/session/login',
    register: (np) => config.passportUrl() + '/home/v1/session/reg',
    logout: (np) => config.passportUrl() + '/home/v1/session/logout',
    getUserInfo: (np) => config.passportUrl() + '/home/v1/session/info',
    refreshToken: (np) => config.passportUrl() + '/home/v1/session/renewal',
    getRegisterCode: (np) => config.passportUrl() + '/home/v1/valid_code/at_reg',
    getForgetCode: (np) => config.passportUrl() + '/home/v1/valid_code/send_at_forget_passwd',
    updateInfo: (np) => config.passportUrl() + '/home/v1/user/update_info',
    notice: (np) => config.passportUrl() + '/home/v1/notice',
    forget: (np) => config.passportUrl() + '/home/v1/user/forget_passwd',
    checkDelegate: (np) => config.passportUrl() + '/home/agency/v1/user/check',
    authCode: (np) => config.passportUrl() + '/home/v1/open/auth_code',
    activity: (np) => config.passportUrl() + '/home/activity/v1/activity_user',
    checkUpdata: (np) => config.passportUrl() + '/home/v1/config',
    lapValidation: (np) => config.passportUrl() + '/home/in_app_purchase/apple/receipt_verify',
    iconAndName: (np) => config.passportUrl() + `/v1/user/user_detail_by_invite_ids?queryGroup=[${np}]`,
    userDetailByInviteIds: (np) => config.passportUrl() + '/home/v1/user/user_detail_by_invite_ids',
    steam: () => config.passportUrl() + '/passport/steam',
    bindSteam: () => config.passportUrl() + '/home/v1/passport/bind_steam_user',
    userDetailByUserIds: (np) => config.passportUrl() + '/home/v1/user/user_detail_by_user_ids',
  },

  // ----------------------------------passportUrl END-------------------------------------------------

  // ----------------------------------walletBG----------------------------------------------------

  // 钱包相关
  wallet: {
    getWalletInfo: (np) => config.walletUrl() + '/home/v1/wallet/' + np,
    lock: (np) => config.walletUrl() + '/home/v1/token_lock',
    getlocked: (np) => config.walletUrl() + `/home/v1/wallet/${np}/locked_amounts`,
    getPoolInfo: (np) => config.walletUrl() + `/home/v1/wallet/${np}/funds_pool_amounts`,
    getConfig: (np) => config.walletUrl() + '/home/v1/config',
    checkInviteCode: (np) => config.walletUrl() + `/home/v1/wallet/order/recharge/valid_recharge_code/${np}`
  },

  // 充值提现相关
  pay: {
    getPayWay: (np) => config.walletUrl() + '/home/v1/payer/' + np,
    rechangeState: (np) => config.walletUrl() + '/home/v1/payer/rechange_state',
    recharge: (np) => config.walletUrl() + '/home/v1/wallet/order/recharge',
    getRecharge: (np) => config.walletUrl() + '/home/v1/wallet/order/recharge/' + np,
    withdraw: (np) => config.walletUrl() + '/home/v1/wallet/order/withdraw',
    refund: (np) => config.walletUrl() + '/home/v1/wallet/order/refund',
    withdrawState: (np) => config.walletUrl() + '/home/v1/payer/withdraw_state',
    pointCardRecharge: (np) => config.walletUrl() + '/home/v1/wallet/order/recharge/card'
  },

  // ----------------------------------walletBG END-------------------------------------------------
  // ----------------------------------promotionBG----------------------------------------------------
  promotion: {
    getDetail: (np) => config.promotionUrl() + '/home/v1/user/detail',
    getTeam: (np) => config.promotionUrl() + '/home/v1/user/team/users',
    receiveIncome: (np) => config.promotionUrl() + '/home/v1/user/team/receive_income',
    getCommission: (np) => config.promotionUrl() + '/home/v1/user/team/commission'
  },

  // ----------------------------------promotionBG END-------------------------------------------------

  // ----------------------------------noticeBG----------------------------------------------------
  notice: {
    getNotice: (np) => config.noticeUrl() + '/home/v1/notice'
  },

  // ----------------------------------douFight----------------------------------------------------
  douFight: {
    getBoxList: (search) => config.boxUrl() + '/home/v1/douBox?limit=1000&page=0' + search,
    getBoxGunList: (id) => config.boxUrl() + `/home/v1/douBox/${id}`,
    boxBattle: (np) => config.boxUrl() + '/home/v1/boxBattle',
    getboxBattle: (limit, search) => config.boxUrl() + `/home/v1/boxBattle?page=0&limit=${limit}` + search,
    douFightRank: (limit) => config.boxUrl() + `/home/v1/summarize/rank?page=0&limit=10&daily_date=${new Date().getTime()}`,
    // getboxBattle: (limit) => config.boxUrl() + `/home/v1/boxBattle?page=0&limit=${limit}`,
    boxBattleRoom: (id) => config.boxUrl() + `/home/v1/boxBattle/${id}`,
    boxBattleJoin: (np) => config.boxUrl() + '/home/v1/boxBattle/join',
  },

  // ----------------------------------douFight END-------------------------------------------------
  steam: {
    bet: (np) => config.diceUrl() + '/home/steam/v1/bet',
    round: (np, limit) => config.diceUrl() + `/public/steam/v1/round?page=0&limit=${limit || 1}&search=status:${np}&searchFields=status:eq`,
    betPool: (roundId) => config.diceUrl() + `/public/steam/v1/round/bet_pool?steam_round_id=${roundId}`,
    gameConfig: (np) => config.diceUrl() + '/public/steam/v1/game/config',
    ranking: (np) => config.diceUrl() + `/public/steam/v1/rank/win?limit=10&page=0&daily_date=${new Date().getTime()}`
  },

  double: {
    round: (np, limit) => config.doubleUrl() + `/public/doubleGame/v1/round?page=0&limit=${limit || 1}&search=status:${np}&searchFields=status:eq`,
    bet: (np) => config.doubleUrl() + '/home/doubleGame/v1/bet',
    bet_pool: (np) => config.doubleUrl() + '/public/doubleGame/v1/round/bet_pool',
    ranking: (np) => config.doubleUrl() + `/public/doubleGame/v1/rank/win_rank?page=0&limit=10&daily_date=${new Date().getTime()}`
  },

  jack: {
    getRound: () => config.jackUrl() + '/home/v1/round',
    postBet: () => config.jackUrl() + '/home/v1/bet',
    getHistory: () => config.jackUrl() + '/home/v1/bet/history'
  },

  // ----------------------------------ECBG END-------------------------------------------------

  // ----------------------------------SIBG-----------------------------------------------------

  socket: {
    getClient: (np) => config.sockClentUrl() + '/auth/v1/client_id'
  },

  // ----------------------------------SIBG END-------------------------------------------------

  // ----------------------------------CSBG-------------------------------------------------
  // csgo cs后台
  csgo: {
    getRollList: (np) => config.csgoUrl() + '/api/steam/RollRoom/index',
    getRollInfo: (np) => config.csgoUrl() + '/api/steam/RollRoom/get',
    getRollJoinUser: (np) => config.csgoUrl() + '/api/steam/RollRoomMember/joined',
    getRollWinner: (np) => config.csgoUrl() + '/api/steam/RollRoomMember/winners',
    joinRoll: (np) => config.csgoUrl() + '/api/steam/RollRoom/join',
    getBoxList: (np) => config.csgoUrl() + '/api/steam/Box/index',
    getBoxInfo: (np) => config.csgoUrl() + '/api/steam/Box/get',
    openBox: (np) => config.csgoUrl() + '/api/steam/Box/open',
    getFreeBoxList: (np) => config.csgoUrl() + '/api/steam/FreeBox/index',
    getFreeBoxInfo: (np) => config.csgoUrl() + '/api/steam/FreeBox/get',
    openFreeBox: (np) => config.csgoUrl() + '/api/steam/FreeBox/open',
    getWinnerHistory: (np) => config.csgoUrl() + '/api/steam/Item/getWinnerHistory',
    getWinnerHistoryFree: (np) => config.csgoUrl() + '/api/steam/Item/getWinnerHistoryFree',
    getMyInventory: (np) => config.csgoUrl() + '/api/steam/Member/myInventory',
    getItemTakeHistory: (np) => config.csgoUrl() + '/api/steam/ItemGetOrder/history',
    saleWeapon: (np) => config.csgoUrl() + '/api/steam/Member/sale',
    itemGet: (np) => config.csgoUrl() + '/api/steam/Member/getBack',
    getStoreItem: (np) => config.csgoUrl() + '/api/store/StoreItem/search',
    getRollItem: (np) => config.csgoUrl() + '/api/store/StoreItem/search',
    buyStoreItem: (np) => config.csgoUrl() + '/api/store/StoreItem/buy',
    getOrderHistory: (np) => config.csgoUrl() + '/api/store/BuyOrder/history',
    saveTradeUrl: (np) => config.csgoUrl() + '/api/account/Member/saveTradeUrl',
    getTradeUrl: (np) => config.csgoUrl() + '/api/account/Member/my',
    getPacksack: () => config.csgoUrl() + '/api/steam/Member/myInventory',
    getFirstRecharge: () => config.csgoUrl() + '/api/account/Member/getFirstRecharge',
    getFirstRechargeBox: () => config.csgoUrl() + '/api/steam/Box/firstRechargeBox',
    getTodyValuable: () => config.csgoUrl() + '/api/steam/BoxOrder/getTodyValuable'
  },

  // ----------------------------------CSBG END-------------------------------------------------

  // ----------------------------------TASKBG-------------------------------------------------
  task: {
    getTask: (np) => config.taskUrl() + '/home/v1/setting/task',
    getQueueTask: (np) => config.taskUrl() + '/home/v1/activity_queue/appoint',
    tackTask: (np) => config.taskUrl() + `/home/v1/activity_user/${np}/settle`,
    gameTask: (np) => config.taskUrl() + `/home/v1/activity_queue?game_type=${np}`,
    getCharge: (np) => config.taskUrl() + `/home/v1/activity_queue/recharge?type=${np}`,
    getUserPromotion: (np) => config.taskUrl() + '/home/v1/activity_user/promotion',
    getQuePromotion: (np) => config.taskUrl() + '/home/v1/activity_queue/promotion',
    activitySettle: (_id) => config.taskUrl() + `/home/v1/activity_user/${_id}/settle`,
    getActivityUserJoin: (np) => config.taskUrl() + '/home/v1/activity_user/join',
    getRollRoom: (np) => config.taskUrl() + '/home/v1/activity_queue/roll_room',
    getRollDetail: (np) => config.taskUrl() + `/home/v1/activity_queue/${np}`,
    getActivityUserInfo: (np) => config.taskUrl() + '/home/v1/activity_user',
  },

  // ----------------------------------poolUrl------------------------------------------------
  pool: {
    getRecord: (np) => config.poolUrl() + '/home/v1/record',
    getPoolInfo: (np) => config.poolUrl() + '/home/v1/user',
    getLotteryList: (np) => config.poolUrl() + '/home/v1/record/list',
    openLottery: (np) => config.poolUrl() + '/home/v1/record',
    steamCheck: (np) => config.poolUrl() + 'home/v1/user/check',
    getPoolList: (np) => config.poolUrl() + 'home/v1/record/history'
  },

  // ----------------------------------TASKBG END-------------------------------------------------

  // ----------------------------------CONFIGBG-------------------------------------------------
  config: {
    getConfig: (np) => config.configUrl() + '/home/v1/data'

  },
  // ----------------------------------CONFIGBG END-------------------------------------------------
  // 第三方数据接口
  other: {
    getIpAddress: (np) => 'https://api.map.baidu.com/location/ip?ak=MCdNYPo50ibDTdw5m0dr1KEwipOXMANn'
  },

  box: {
    getAllTypeBoxs: (np) => config.boxUrl() + '/home/box/v1/get_all_type_boxs',
    getSteamUserInfo: (np) => config.boxUrl() + '/home/user/v1/get_user_info',
    getBoxDetailData: (np) => config.boxUrl() + `/home/box/v1/get_box_detail/${np}`,
    openBox: (np) => config.boxUrl() + `/home/box/v1/open_box/${np}`,
    getBoxOpenData: (np) => config.boxUrl() + '/home/v1/boxOpenOrderDetail',
    getRecentUnboxList: (np) => config.boxUrl() + '/home/box/v1/get_recent_unbox_list',
    exchange: (np) => config.boxUrl() + `/home/user_item/v1/exchange/${np}`,
    withdraw: (np) => config.boxUrl() + `/home/user_item/v1/withdraw/${np}`,
    setUserInfo: (np) => config.boxUrl() + '/home/user/v1/set_user_info',
    getWithdrawOrders: (np) => config.boxUrl() + '/home/user_item/v1/get_withdraw_orders',
    getUserItemList: (np) => config.boxUrl() + '/home/user_item/v1/get_user_item_list',

  },
  retrieve: {
    getBack: (np) => config.retrieveUrl() + '/home/v1/itemWithdrawOrder',
  },
  backpack: {
    getUserItemList: (np) => config.boxUrl() + '/home/user_item/v1/get_user_item_list',
  }
}

export default API
