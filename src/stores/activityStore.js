import api from '@configs/api';
import service from '@service';
import dealErrCode from '@utils/dealErrCode';
import { action, autorun, observable, toJS } from 'mobx';
import { getExteriorMap } from '@assets/data/boxenum/exterior';
import { getQualityMap } from '@assets/data/boxenum/quality';
import { message} from 'antd';

class ActivityStore {
  constructor (appStore) {
    this.appStore = appStore
    autorun(() => {
      if (this.appStore.isAuth) {
        // this.getTask()
        // this.getEncourageTask()
        // this.getSevenDayTask()
      } else {
        this.initData()

      }
    })

  }

  // -----------------------------------领取奖励活动-START----------------------

  @observable tackLoading = true
  @observable encourageLoading = true
  @observable sevenDayLoading =true
  @observable encourageCount= 0
  @observable taskCount= 0
  @observable taskLock = false

  @observable taskData = {
    list: []
  }

  @observable encourageData = {}

  @observable encourageListData= {}

  @observable encourageCurrentData = {
    value: '',
    istoday: '',
    startTime: '',
    overTime: '',
    isweekend: '',
    last: ''
  }

  @observable sevenDayData = {}

  @observable everydayList = []

  @action initData = () => {
    this.tackLoading = true
    this.encourageLoading = true
    this.sevenDayLoading = true
    this.encourageCount = 0
    this.taskCount = 0
    this.taskData = {
      list: []
    }
    this.encourageData = {}
    this.encourageListData = {}
    this.encourageCurrentData = {
      value: '',
      istoday: '',
      startTime: '',
      overTime: '',
      isweekend: '',
      last: ''
    }
    this.sevenDayData = {}
    this.everydayList = []
    this.completeProgress = 100
    this.levelList = {}
    this.rewardList = []
    this.rollIndex = 1
    this.teamArr = []
    this.userPromotions = []
    this.taskID = null

    clearInterval(this.encourageInterval)
    clearInterval(this.taskInterval)
  }

  @action getTaskData = async () => {
    const params = {
      page: 0,
      limit: 10,
      type: 'everyday'
    }
    const res = await service.request(api.task.getTask(), 'GET', params)
    return res
  }

  @action getqueueTask = async (obj) => {
    const res = await service.request(api.task.getQueueTask(), 'GET', obj, {load: true})
    return res
  }

  @action tackTask = async (_id) => {
    const res = await service.request(api.task.tackTask(_id), 'PUT')
    return res
  }

  @action getTask = async () => {
    try {
      this.tackLoading = true
      const res = await this.getTaskData()
      this.tackLoading = false
      if (res && res.code === 0) {
        this.taskData = res.data
        if (res.data.list.length > 0) {
          const countDown = res.data.list[0].countDown
          this.taskCountDown(countDown)
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  taskCountDown = (countDown) => {
    try {
      if (countDown > 0) {
        this.taskInterval = setInterval(() => {
          if (countDown <= 0) {
            clearInterval(this.taskInterval)
            this.taskCount = 0
            this.getTask()
          } else {
            countDown -= 1000
            this.taskCount = this.countdownTime(countDown)
          }
        }, 1000)
      } else {
        this.taskCount = 0
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  @action autoGetTask = async () => {
    const params = {
      name: 'encourage'
    }
    const res = await this.getqueueTask(params)
    if (res && res.code === 0) {
      if (res.data.activityUser === 0) {
        const params = {
          name: 'encourage'
        }
        const res = await this.getqueueTask(params)
        if (res && res.code === 0) {
          this.handleTack(res.data.queue._id, 3, true)
        }
      }
    }
  }

  countdownTime = (countdowmTime) => {
    let runTime = parseInt(countdowmTime / 1000)
    const day = Math.floor(runTime / 86400)
    runTime = runTime % 86400
    const hour = Math.floor(runTime / 3600)
    runTime = runTime % 3600
    const minute = Math.floor(runTime / 60)
    runTime = runTime % 60
    const second = runTime
    let time = 0
    if (day) {
      time = `${day}:${hour}:${minute}:${second}`
    } else if (hour) {
      time = `${hour}:${minute}:${second}`
    } else if (minute) {
      time = `${minute}:${second}`
    } else if (second) {
      time = `${second}`
    }
    return time
  }

  @action getEncourageTask = async () => {
    try {
      const params = {
        name: 'encourage'
      }
      this.encourageLoading = true
      const res = await this.getqueueTask(params)
      this.encourageLoading = false
      if (res && res.code === 0) {
        const list = res.data.queue.options.capital_change_by_week
        if (list) {
          let encourageListData = {}
          for (let i = 0; i < list.length; i++) {
            // 数组排序按0~6划分周一到周日
            const item = list[i]
            let obj = {}
            obj.value = item
            obj._id = res.data.queue._id
            obj.last = res.data.queue.options.acquisition_num - res.data.activityUser
            if (i === res.data.week) {
              obj.istoday = true
              obj.startTime = res.data.startTime
              obj.overTime = res.data.overTime
            } else {
              obj.istoday = false
              obj.startTime = 0
              obj.overTime = 0
            }
            if (i >= 5) {
              obj.isweekend = true
            } else {
              obj.isweekend = false
            }
            encourageListData[i] = obj
          }

          this.encourageListData = encourageListData
          this.encourageCurrentData = encourageListData[res.data.week]
          this.encourageCountDown(res.data.countDown)
        }
        this.encourageData = res.data
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  @action encourageCountDown = (countDown) => {
    try {
      if (countDown > 0) {
        this.encourageInterval = setInterval(() => {
          if (countDown <= 0) {
            clearInterval(this.encourageInterval)
            this.encourageCount = 0
            this.getEncourageTask()
          } else {
            countDown -= 1000
            this.encourageCount = this.countdownTime(countDown)
          }
        }, 1000)
      } else {
        this.encourageCount = 0
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  getSevenDayTask = async () => {
    try {
      const params = {
        name: 'sevenDay'
      }
      this.sevenDayLoading = true
      const res = await this.getqueueTask(params)
      this.sevenDayLoading = false
      if (res && res.code === 0) {
        const list = res.data.queue.options.cash_coupon
        if (list) {
          let everydayList = []
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            let obj = {}
            if (i + 1 < res.data.activityUser) {
              obj.istack = true
              obj.isCurrent = false
            } else if (i + 1 === res.data.activityUser) {
              if (res.data.receiveChcek) {
                obj.istack = false
                obj.isCurrent = true
              } else {
                obj.istack = true
                obj.isCurrent = false
              }
            } else if (i + 1 === res.data.activityUser + 1) {
              if (res.data.receiveChcek) {
                obj.istack = false
                obj.isCurrent = false
              } else {
                obj.istack = false
                obj.isCurrent = true
              }
            } else {
              obj.istack = false
              obj.isCurrent = false
            }
            obj.value = item
            everydayList.push(obj)
          }
          // console.log('item', everydayList)
          this.everydayList = everydayList
        }
        this.sevenDayData = res.data
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  @action handleTack = async (_id, type, show) => {
    try {
      if (this.taskLock) {
        return
      }
      this.taskLock = true
      const res = await this.tackTask(_id)
      this.taskLock = false
      console.log('handleTack', res);
      if (res && res.code === 0) {
        if (!show) {
          message.success('领取奖励成功')
        }
        if (type === 1) {
          this.getTask()

        } else if (type === 2) {
          this.getSevenDayTask()

        } else if (type === 3) {
          this.getEncourageTask()
          this.appStore.refreshWalletInfo()
        }
      } else {
        dealErrCode.dealActivityErrCode(res.code)
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  // -----------------------------------领取奖励活动-END----------------------


  // -----------------------------------领取红包-START----------------------
  @observable RedEnvelopeInfoData = {users: []}
  @observable loadingShow = false

  @action setLoadingShow = (value) => {
    this.loadingShow = value
  };
  // 加入活动都是调用这个方法
  @action getActivityUserJoin = async (parmas) => {
    try {
      const res = await service.request(api.task.getActivityUserJoin(), 'PUT', parmas);
      if (res.code === 0) {
        this.RedEnvelopeInfoData = res.data
      }
      return res;
    } catch (error) {
      console.log('error', error);
    }
  }
 ;
  // -----------------------------------领取红包-END----------------------


  // -----------------------------------ROLL房-START----------------------

  formatName = (itemName) => {
    let item = {
      $firstname: '',
      $firstTypename: '',
      $twoname: '',
      $threename: ''
    }
    let itemNames = itemName.split('|')
    if (itemNames.length === 2) {
      let wenpenName = itemNames[0]
      let typeName = itemNames[1]
      item.$firstname = wenpenName
      let wenpenNameType = []
      if (wenpenName.indexOf('（') !== -1) {
        wenpenNameType = wenpenName.split('（')
        if (wenpenNameType.length === 2) {
          let firstTypename = wenpenNameType[0]
          item.$firstTypename = firstTypename
        } else {
          item.$firstTypename = wenpenName
        }
      } else if (wenpenName.indexOf('(') !== -1) {
        wenpenNameType = wenpenName.split('(')
        if (wenpenNameType.length === 2) {
          let firstTypename = wenpenNameType[0]
          item.$firstTypename = firstTypename
        } else {
          item.$firstTypename = wenpenName
        }
      } else {
        item.$firstTypename = wenpenName
      }

      let wenpenQualityType = []
      if (typeName.indexOf('（') !== -1) {
        wenpenQualityType = typeName.split('（')
      } else if (typeName.indexOf('(') !== -1) {
        wenpenQualityType = typeName.split('(')
      }
      item.$twoname = wenpenQualityType[0]
      item.$threename = '(' + wenpenQualityType[1]
      return item
    }
  }
  formatWeapon = (item) => {
    let params = {}
    if (item) {
      params = item;
    }
    let nameObj = this.formatName(params.item_name)
    item.$firstTypename = nameObj.$firstTypename
    item.$firstname = nameObj.$firstname
    item.$threename = nameObj.$threename
    item.$twoname = nameObj.$twoname
    item.$exterior = getExteriorMap(params.exterior || 'WearCategory0')
    item.$rarityBgClass = getQualityMap(params.quality || 'Rarity_Common_Weapon').bgClass
    return  item;
  }
  formatBg=(item) => {
    let params = {}
    if (item) {
      params = item;
    }
    item.$myrarityBgClass = getQualityMap(params.options.roll_items[0].quality || 'Rarity_Common_Weapon').bgClass
    return  item;
  }
  @observable RollRoomData = {list: []}
  @observable rollType = 'open'
  @observable rollPageData = {
    page: 0,
    limit: 6,
    type: 'open',
    total: 0,
    load: false,
  };
  @observable allUserPage = {
    allPage: 0,
    allLimit: 18,
    allTotal: 0,
  };
  @observable winUserPage = {
    winPage: 0,
    winLimit: 18,
    winTotal: 0,
  };
  @observable rollLoad=false
  @observable tabsData = [{title: '进行中', key: 'open'}, {title: '我参加的', key: 'mine'}, {title: '已结束', key: 'close'}]
  @observable RollDetailData={options: {roll_items: []}}
  @observable RollItems=[]
  @observable AllUserData={list: []}
  @observable WinUserData={list: []}
  @observable showRoll=false
  @observable btnLoad=false
  @observable activity_id=''
  @observable limitType=true
  @observable myImg=''
  @action setRollType = (value) => {
    this.rollType = value
  }
  @action setRollData = (key, value) => {
    this.rollPageData[key] = value
  }
  @action setAllData = (key, value) => {
    this.allUserPage[key] = value
  }
  @action setWinData = (key, value) => {
    this.winUserPage[key] = value
  }
  @action setShowRoll = (value) => {
    this.showRoll = value
  }
  @action setBtnLoad= (value) => {
    this.btnLoad = value
  }
  @action setLimitType= (value) => {
    this.limitType = value
  }
  @action getRollRoom=async (parmas) => {
    this.rollPageData.load = true
    try {
      if (!parmas) {
        parmas = {
          page: this.rollPageData.page,
          limit: this.rollPageData.limit,
          type: this.rollPageData.type,
        }
      }
      const res = await service.request(api.task.getRollRoom(), 'GET', parmas);
      if (res.code === 0) {
        for (let i = 0; i < res.data.list.length; i++) {
          let goodsItem = res.data.list[i];
          goodsItem = this.formatBg(goodsItem)
        }
        this.RollRoomData = res.data
        this.rollPageData.load = false
        this.rollPageData.total = Math.ceil(res.data.total / 6) * 10
      }
      return res;
    } catch (error) {
      console.log('error', error);
    }
  }
  @action getRollDetail=async (_id) => {
    this.rollLoad = true
    try {
      const res = await service.request(api.task.getRollDetail(_id), 'GET');
      if (res.code === 0) {

        for (let i = 0; i < res.data.options.roll_items.length; i++) {
          let goodsItem = res.data.options.roll_items[i];
          goodsItem = this.formatWeapon(goodsItem)
        }

        this.RollDetailData = res.data
        this.RollDetailData = this.formatBg(this.RollDetailData)
        this.RollItems = res.data.options.roll_items
        this.myImg = res.data.options.roll_items[0].icon_url
        this.activity_id = _id
        this.rollLoad = false
      }
      return res;
    } catch (error) {
      console.log('error', error);
    }
  }
  @action getActivityUserInfo=async (parmas) => {
    try {

      const res = await service.request(api.task.getActivityUserInfo(), 'GET', parmas);
      if (res.code === 0) {
        this.AllUserData = res.data
        this.allUserPage.allTotal = Math.ceil(res.data.total / 18) * 10
      }
      return res;
    } catch (error) {
      console.log('error', error);
    }
  }
  @action getActivityWinnerInfo =async (parmas) => {
    try {
      const res = await service.request(api.task.getActivityUserInfo(), 'GET', parmas);
      if (res.code === 0) {
        this.WinUserData = res.data
        this.winUserPage.winTotal = Math.ceil(res.data.total / 18) * 10
      }
      return res;
    } catch (error) {
      console.log('error', error);
    }
  }
  // -----------------------------------ROLL房-END----------------------
}

export default  ActivityStore
