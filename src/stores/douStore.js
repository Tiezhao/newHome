import { action, observable, computed, toJS, autorun } from 'mobx'
import service from '@service'
import api from '@configs/api'
import { message } from 'antd';
import methods from '@utils/methods'
import history from '@router/history'


const pullKongList = (list, mode, val = '') => {
  const count = mode - list.length
  for (let i = 0; i < count; i++) {
    list.push(val)
  }
  return list
}


class DouStore {

  constructor (appStore) {
    this.appStore = appStore

    autorun(() => {
      if (this.showModel) {
        console.log('this.showModel: ', this.showModel);
        this.audioRef && this.audioRef.audioEl.current.play()
      }
    })

  }

  // 斗箱房间列表逻辑

  @observable isLastPage = false

  @observable jionLoading = false

  @observable pageSize = 0

  @observable roomList = []

  @observable roomListLoading = false

  @action getAsyncRoomList = async () => {
    this.pageSize += 8
    this.roomListLoading = true
    let queryGroups = [['status', 'in', [1, 30, 35, 40]]]
    queryGroups = JSON.stringify(queryGroups)
    const searchStr = `&queryGroups=${queryGroups}`
    const res = await service.request(api.douFight.getboxBattle(this.pageSize, searchStr), 'GET')
    this.getEndRoomList()
    if (res.code === 0) {
      for (const item of res.data.list) {
        item.user_ids = pullKongList(item.user_ids, item.mode)
      }
      this.roomList = res.data.list
      if (res.data.list.length === res.data.total) {
        this.isLastPage = true
      }
    }
    this.roomListLoading = false
  }

  @action getEndRoomList = async (limit = 8) => {
    const strTime = methods.getLocalTime(0)
    // const searchStr = `&search=status:[40];created_at:${strTime.toISOString()}&searchFields=status:in;create_at:gte`
    let queryGroups = [['status', 'in', [40]], ['created_at', 'lte', strTime.toISOString()]]
    const searchStr = `&queryGroups=${queryGroups}`
    const res = await service.request(api.douFight.getboxBattle(limit, searchStr), 'GET')
  }

  @action unShiftRoomList = (val) => {
    const data = {...val, _id: val.room_id, user_ids: pullKongList(val.user_ids, val.mode)}
    const res = this.roomList.find((ele) => ele._id === val.room_id)
    if (!res) {
      this.roomList.unshift(data)
    }
  }

  @action updateRoomList = (val) => {
    for (let item of this.roomList) {
      if (item._id === val.room_id) {
        item.status = val.status
        item.user_ids = val.user_ids ? val.user_ids : item.user_ids
        item._id = val.room_id ? val.room_id : item._id
        item.user_ids = val.user_ids ? pullKongList(val.user_ids, val.mode) : item.user_ids
      }
    }
  }

  @action goRoom = async (room_id) => {
    history.push(`/home/douopen/${room_id}`)
  }

  @action joinAsyncRoom = async (room_id) => {
    if (!this.appStore.isAuth) {
      this.appStore.modalStore.setShowAuth(true)
      return
    }
    const options = {
      room_id
    }
    this.jionLoading = true
    const res = await service.request(api.douFight.boxBattleJoin(), 'POST', options)
    if (res.code === 0) {
      message.success('加入成功')
      this.appStore.refreshWalletInfo()
    } else if (res.code === 1) {
      message.error('您的余额不足参与此轮游戏')
    } else if (res.code === 31) {
      message.error('加入中,请稍等')
    } else {
      switch (res.code) {
      case 12:
        message.error('房间id不存在')
        break;
      case 15:
        message.error('房间状态不可加入')
        break;
      case 11:
        message.error('重复加入房间')
        break;
      }
    }
    this.jionLoading = false
  }

  getKongNum = (list = []) => {
    let num = 0
    for (const item of list) {
      if (!item) {
        num += 1
      }
    }
    return num
  }

  @action queryJionRoom = () => {
    const { userInfo } = this.appStore
    let res = {}
    let index = 0
    for (const item of this.roomList) {
      index += 1
      if (item.room_user_id !== userInfo._id) {
        if (0 < this.getKongNum(item.user_ids)) {
          res = {...item, index}
          if (this.getKongNum(item.user_ids) < this.getKongNum(res.user_ids)) {
            res = {...item, index}
          }
        }
      }
    }

    if (Object.keys(res).length === 0) {
      message.error('没有找到合适的房间, 请稍后再试')
    } else {
      this.goRoom(res._id)
    }
  }

  // 历史记录

  @observable isHisLastPage = false

  @observable historyLoading = false

  @observable historyList = []

  @observable getHistoryList = async (limit, type) => {
    const { userInfo } = this.appStore
    this.historyLoading = true
    let queryGroups
    let searchStr
    if (type === 'self') {
      searchStr = `&search=status:[40];user_ids:[${userInfo._id}]&searchFields=status:in;user_ids:in&searchTypes=status:number;user_ids:object_id`
    } else {
      queryGroups = [['status', 'eq', 40]]
      searchStr = `&queryGroups=${JSON.stringify(queryGroups)}`
    }

    const res = await service.request(api.douFight.getboxBattle(limit, searchStr), 'GET')
    if (res.code === 0) {
      this.historyList = res.data.list
      if (res.data.list.length === res.data.total) {
        this.isHisLastPage = true
      }
    } else {
      this.historyList = []
      this.isHisLastPage = true
    }
    this.historyLoading = false
  }

  // 斗箱详情逻辑

  room_id // 房间id

  @observable amountList = [0, 0, 0, 0]

  @observable detailLoading = false

  @observable showModel = false

  @observable roomDetail = {
    user_ids: [],
    boxsDetail: []
  }

  getAllGun = (idList, boxList) => {
    const resList = []
    for (let i = 0; i < idList.length; i++) {
      const item = idList[i];
      for (let j = 0; j < boxList.length; j++) {
        const box = boxList[j];
        const gunRes = box.box_items[item.id]
        if (gunRes) {
          const res = this.appStore.boxStore.formatWeapon(gunRes)
          resList.push({...res, selfKey: item.id + item.index + item.rendomStr })
          break
        }
      }
    }

    console.log('====================================');
    console.log(toJS(resList));
    console.log('====================================');
    return resList
  }

  @action initAmountList = (res) => {

    let newLIst = []
    if (res.status === 1) {
      newLIst = [0, 0, 0, 0]
    } else {
      res.step && res.userDetail.forEach((ele, index) => {
        newLIst[index] = 0
        if (ele.winItem.length) {
          const sum = ele.winItem.slice(0, res.status === 40 ? res.step : res.step - 1).reduce(function (prev, cur) {
            return prev + cur.exchange_price;
          }, 0);
          newLIst[index] = sum
          console.log('我是初始化总量', newLIst, res.step);
        }
      });
    }
    for (let i = 0; i < 5 - newLIst.length; i++) {
      newLIst.push(0)
    }

    this.amountList = newLIst
  }

  @action animateFinish = (val, index) => {
    const amountList = [...this.amountList]
    let amount = amountList[index] || 0
    amount += val.exchange_price || 0
    amountList[index] = amount
    this.amountList = amountList
  }

  @action getRoomDetail = async (room_id = this.room_id) => {
    console.log('room_id: 入入入', room_id);
    let res = {}
    const isObj = typeof room_id === 'object'
    if (isObj && room_id._id === this.room_id) {
      res.code = 0
      res.data = room_id
    } else {
      this.room_id = room_id
      this.detailLoading = true
      res = await service.request(api.douFight.boxBattleRoom(room_id), 'GET')
      this.detailLoading = false
    }


    if (res.code === 0) {
      const data = res.data
      data.user_ids = pullKongList(data.user_ids, data.mode)
      data.userDetail = pullKongList(data.userDetail, data.mode, {})
      const userIds = data.userDetail.map((e) => e.user_id)
      const usersRes = await this.queryUserInfo(userIds)
      for (const item of data.userDetail) {
        if (item.winItem) {
          const winItem = item.winItem.map((id, index) => ({id, index, rendomStr: methods.randomString(6)}))
          item.winItem = this.getAllGun(winItem, data.boxsDetail)
        }
      }
      if (usersRes.code === 0) {

        let count = 0
        data.userDetail = data.userDetail.map((val, index) => {
          if (val.win) {
            count++
          }
          return {...val, ...usersRes.data.list.find((f) => f._id === val.user_id)}
        })
        this.initAmountList(data)

        // 处理用户金额
        if (data.status === 40) {
          if (count > 1) {
            data.userDetail = data.userDetail.map((val) => {
              if (!val.win) {
                val.pool_amount = val.payout
                val.winItem = []
              } else {
                val.pool_amount += val.payout
              }
              return val
            })
          } else if (count === 1) {
            data.userDetail = data.userDetail.map((val) => {
              if (!val.win) {
                const winItem = data.userDetail.find((e) => e.win)
                winItem.pool_amount += val.pool_amount
                val.pool_amount = val.payout
                val.winItem = []
              } else {
                val.pool_amount += val.payout
              }
              return val
            })
          }
        }
      }
      this.roomDetail = data
    }
  }

  @action updateRoomDetail = async (val) => {
    console.log('updateRoomDetail: ============>', val, toJS(this.roomDetail));
    if (val.room_id === this.roomDetail._id) {

      if (val.status === 1) {
        const user_ids = pullKongList(val.user_ids, val.mode)
        let userDetail = pullKongList(val.userDetail, val.mode, {})
        const userIds = userDetail.map((e) => e.user_id)
        const usersRes = await this.queryUserInfo(userIds)
        userDetail = userDetail.map((val) => ({...val, ...usersRes.data.list.find((f) => f._id === val.user_id)}))
        const data = Object.assign(this.roomDetail, {user_ids, userDetail})
        this.roomDetail = data
      } else {

        if (val.status > this.roomDetail.status) {
          return
        }

        if (val.step === this.roomDetail.step) {
          return
        }
        console.log('=========进入了');

        const data = Object.assign(this.roomDetail, val)

        this.roomDetail = data
        this.initAmountList(data)
        setTimeout(() => {
          const { step } = this.roomDetail
          this.roomDetail.userDetail.forEach((val, index) => {
            const winItem = val.winItem.length > 0 && val.winItem[step - 1]
            winItem && this.animateFinish(winItem, index)
          })
        }, 2000);

        if (this.roomDetail.step === this.roomDetail.boxs.length) {
          setTimeout(() => {
            const newData = {...this.roomDetail}
            newData.status = 40
            let count = 0
            newData.userDetail = newData.userDetail.map((val) => {
              if (!val.win) {
                val.winItem = []
              } else {
                count++
              }
              return val
            })
            // 处理用户金额
            if (count > 1) {
              data.userDetail = data.userDetail.map((val) => {
                if (!val.win) {
                  val.pool_amount = val.payout
                  val.winItem = []
                } else {
                  val.pool_amount += val.payout
                }
                return val
              })
            } else if (count === 1) {
              data.userDetail = data.userDetail.map((val) => {
                if (!val.win) {
                  const winItem = data.userDetail.find((e) => e.win)
                  winItem.pool_amount += val.pool_amount
                  val.pool_amount = val.payout
                  val.winItem = []
                } else {
                  val.pool_amount += val.payout
                }
                return val
              })
            }
            this.roomDetail = newData
            this.showModel = true
            this.getAsyncDouRank()
            this.appStore.refreshWalletInfo()
          }, 3000);
        }
      }


    }
  }

  @action toggleShowModel = (flag) => {
    this.showModel = flag
  }

  // 斗箱排行榜逻辑
  @observable douRank = []

  @observable roomRankLoading = false

  queryUserInfo = async (list = []) => {
    const lastList = []
    for (const item of list) {
      if (item) {
        lastList.push(item)
      }
    }
    const params = {
      page: 0,
      limit: list.length,
      queryGroup: `[["_id","in",${JSON.stringify(lastList)}]]`,
      searchTypes: '_id:object_id'
    }
    const res = await service.request(api.user.userDetailByUserIds(), 'GET', params)
    return res
  }

  @action getAsyncDouRank = async () => {
    this.roomRankLoading = true
    const res = await service.request(api.douFight.douFightRank(), 'GET')
    if (res.code === 0) {
      const userIds = res.data.list.map((e) => e.account)
      let lastList = res.data.list
      const usersRes = await this.queryUserInfo(userIds)
      if (usersRes.code === 0) {
        lastList = lastList.map((val) => ({...val, ...usersRes.data.list.find((f) => f._id === val.account)}))
      }
      this.douRank = lastList
    }

    this.roomRankLoading = false
  }

  // 斗箱创建房间逻辑

  @observable boxListLoding = false

  @observable createLoading = false

  @observable boxList = []

  @observable roomForm = {
    mode: 2,
    boxs: [],
  }

  @action createAsyncRoom = async () => {
    let boxId = []
    for (const item of this.boxList) {
      if (item.check) {
        for (let i = 0; i < item.num; i++) {
          boxId.push(item._id)
        }
      }
    }
    if (boxId.length > 20) {
      message.error('回合数最大为20场')
      return
    }
    const options = {
      ...this.roomForm,
      boxs: boxId
    }
    this.createLoading = true
    const res = await service.request(api.douFight.boxBattle(), 'POST', options)
    if (res.code === 0) {
      message.success('创建房间成功')
      this.initBoxList()
      this.appStore.refreshWalletInfo()
      this.goRoom(res.data.room_id)
      this.getRoomDetail(res.data.room_id)
    } else if (res.code === 1) {
      message.error('您的余额不足创建此房间')
    } else {
      message.error('创建房间失败')
    }
    this.createLoading = false
  }

  @action setRoomForm = (key, value) => {
    this.roomForm[key] = value
  }

  @action getAsyncBoxList = async (value) => {
    this.boxListLoding = true
    let queryGroups = [['name', 'like', value]]
    queryGroups = JSON.stringify(queryGroups)
    const searchStr = value ? `&queryGroups=${queryGroups}` : ''
    const res = await service.request(api.douFight.getBoxList(searchStr), 'GET')
    this.boxListLoding = false
    if (res.code === 0) {
      let list = res.data.list
      list = list.map((e) => ({...e, num: 1, check: false}))
      this.boxList = list
    }
  }

  @action setBoxList = (id, flag) => {
    for (const item of this.boxList) {
      if (item._id === id) {
        item.check = flag
      }
    }
  }

  @action initBoxList = () => {
    this.roomForm = {
      mode: 2,
      boxs: [],
    }
    for (const item of this.boxList) {
      item.check = false
      item.num = 1
    }
  }

  @action changeRoundNum = (id, num) => {
    for (const item of this.boxList) {
      if (item._id === id) {
        item.num = Number(num || 1)
      }
    }
  }

  // 查看宝箱武器列表

  @observable boxGunList = []

  @observable gunListLoad = false

  @action getBoxGunList = async (_id) => {
    this.gunListLoad = true
    // const res = await service.request(api.douFight.getBoxGunList(_id), 'GET')
    const res = await service.request(api.box.getBoxDetailData(_id), 'GET');
    this.gunListLoad = false
    if (res.code === 0) {
      res.data.box_items = methods.getMinSort(res.data.box_items, 'show_winning_rate')
      for (let i = 0; i < res.data.box_items.length; i++) {
        let goodsItem = res.data.box_items[i];
        goodsItem = this.appStore.boxStore.formatWeapon(goodsItem)

      }

      let priceItem = res.data;
      priceItem['$actualPurchase'] = this.appStore.boxStore.formatPrice(priceItem)
      let showItem = res.data
      showItem['$showImg'] = this.appStore.boxStore.formatImg(showItem)
      // console.log('this.boxDetailData', toJS(this.boxDetailData))
      this.boxGunList = res.data.box_items

      console.log('7777777777777777777777777', res.data);
    }
  }

  // 播放音效

  audioRef = null;

  setAudio = (ref) => {
    this.audioRef = ref
  }

  @computed get roundNum () {
    const list = this.boxList.filter((e) => e.check)
    let num = 0
    for (const item of list) {
      num += item.num
    }
    return num
  }

  @computed get roundMoney () {
    const list = this.boxList.filter((e) => e.check)
    let gold = 0
    for (const item of list) {
      gold += item.num * item.purchase
    }
    return gold
  }

}
export default DouStore
