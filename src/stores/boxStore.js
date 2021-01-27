import { action, observable, toJS} from 'mobx'
import api from '@configs/api'
import service from '@service'
import _ from 'lodash';
import { getExteriorMap } from '@assets/data/boxenum/exterior';
import { getQualityMap } from '@assets/data/boxenum/quality';
import history from '@router/history';
import methods from '@utils/methods'
class BoxStore {

  // -----------------------箱子首页-start--------------------------
    @observable allTypeBoxsData = {
      list: []
    }
    @observable showLottery = false


    @observable boxLoading = false

    @action setShowLottery = (value) => {
      this.showLottery = value
    }

    formatPrice=(item) => {
      let $actualPurchase = methods.FloatSlice(item.purchase * (item.discount / 100), 1, false)
      return $actualPurchase
    }
    @action getAllTypeBoxs = async () => {
      try {
        this.boxLoading = true
        const res = await service.request(api.box.getAllTypeBoxs(), 'GET');
        this.boxLoading = false
        if (res.code === 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            let boxType = res.data.list[i];
            for (let j = 0; j < boxType.boxs.length; j++) {
              let boxItem = boxType.boxs[j];
              boxItem['$actualPurchase'] = this.formatPrice(boxItem)
              if (boxItem.discount === 100) {
                boxItem['hasdis'] = false
              } else {
                boxItem['hasdis'] = true
              }
            }
            boxType.boxs = methods.getMinSort(boxType.boxs, '$actualPurchase')
          }
          this.allTypeBoxsData = res.data
          // console.log('this.allTypeBoxsData', toJS(this.allTypeBoxsData))
        }
      } catch (error) {
        console.log('error', error);
      }

    };


    @action switchHDImg = (url) => {

      let hdurl = ''
      if (url) {
        if (url.indexOf('x-oss-process=image') !== -1) {
          url.split('x-oss-process=image');
          let urls = url.split('?x-oss-process=image') || []
          if (urls.length > 0) {
            hdurl = urls[0]

          }
        } else {
          return url
        }
      }
      return hdurl
    }

    // -----------------------箱子首页-end--------------------------


    // -----------------------箱子历史-start--------------------------

  @observable recentUnboxData = {
    list: []
  }

  @observable historyLoad = false

  @action getRecentUnboxList = async () => {
    const parmas = {
      page: 0,
      limit: 20
    }
    this.historyLoad = true
    const res = await service.request(api.box.getRecentUnboxList(), 'GET', parmas);
    this.historyLoad = false
    if (res.code === 0) {
      for (let i = 0; i < res.data.list.length; i++) {
        let goodsItem = res.data.list[i];
        goodsItem = this.formatWeapon(goodsItem)
      }

      this.recentUnboxData = res.data
    }
  }

  @action addOne = (data) => {
    this.recentUnboxData.list.unshift(data)
  }

  // -----------------------箱子历史-end--------------------------


  // -----------------------开箱-start--------------------------


  @observable boxinfoload = false


  @observable boxDetailData = {
    box_items: []
  }

  @observable  boxType = false

  @observable boxResultData = {
    allPrice: 0,
    selectBet: 0,
    resultList: []
  }


  @observable awardGroupList = []

  @observable openBoxLoad = false

  @action setBoxType = (value) => {
    this.boxType = value
  }

  @action setAwardGroupList = (value) => {
    this.awardGroupList = value
  }

  @action setOpenBoxLoad = (value) => {
    this.openBoxLoad = value
  }


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
    if (item.detail) {
      params = item.detail;
    } else if (item.item_detail) {
      params = item.item_detail;
    }
    let nameObj = this.formatName(params.item_name)
    item.$firstTypename = nameObj.$firstTypename
    item.$firstname = nameObj.$firstname
    item.$threename = nameObj.$threename
    item.$twoname = nameObj.$twoname
    item.$exterior = getExteriorMap(params.extends.exterior || 'WearCategory0')
    item.$rarityBgClass = getQualityMap(params.extends.quality || 'Rarity_Common_Weapon').bgClass
    return  item;
  }
 formatImg=(item) => {
   let $showImg = item.box_items[0].detail.icon_url
   return $showImg
 }
  @action getBoxDetailData = async (_id) => {
    try {
      this.boxinfoload = true
      const res = await service.request(api.box.getBoxDetailData(_id), 'GET');

      this.boxinfoload = false
      if (res.code === 0) {
        res.data.box_items = methods.getMinSort(res.data.box_items, 'show_winning_rate')
        for (let i = 0; i < res.data.box_items.length; i++) {
          let goodsItem = res.data.box_items[i];
          goodsItem = this.formatWeapon(goodsItem)

        }

        let priceItem = res.data;
        priceItem['$actualPurchase'] = this.formatPrice(priceItem)
        let showItem = res.data
        showItem['$showImg'] = this.formatImg(showItem)
        this.boxDetailData = res.data
        // console.log('this.boxDetailData', toJS(this.boxDetailData))
        this.initMachine(res.data)
      } else {
        history.replace('/');
      }


    } catch (error) {
      console.log('error', error);
    }

  }

  @action initMachine = (boxDetailData) => {
    // 先把最多开箱次数预设出来
    let groupList = []
    for (let i = 0; i < 5; i++) {
      groupList.push(this.initSlideItemData(boxDetailData))
    }
    // console.log('groupList', toJS(groupList));
    this.setAwardGroupList(groupList)

  }

  @action initSlideItemData = (boxDetailData) => {
    if (boxDetailData && boxDetailData.box_items) {
      let  goodsList =  _.cloneDeep(boxDetailData.box_items)
      const slideList = [];
      let i = 0;
      while (i++ < 60) {
        slideList.push({ ...goodsList[Math.floor(Math.random() * goodsList.length)] });
      }

      slideList.sort((a, b) => a.$sort - b.$sort);
      return slideList;
    }

  }


  @action openBox = async (_id, betCount) => {
    const parmas = {
      quantity: betCount,
    }
    this.setOpenBoxLoad(true)
    const res = await service.request(api.box.openBox(_id), 'POST', parmas);
    this.setOpenBoxLoad(false)
    return res

  }

  @action setBoxResultData = (value) => {
    // console.log('BoxResultData:', value)
    // 重置boxResultData的值
    this.boxResultData = value
  }


  // -----------------------开箱-end--------------------------

  // -----------------------取回-回收--------------------------


  @action checkoutSteamUrl = (url) => {
    const link = 'steamcommunity.com/tradeoffer/new'
    if (url.indexOf('link') !== -1) {
      return true
    } else {
      return false
    }
  }


  @action withdraw = async (_id) => {
    const res = await service.request(api.box.withdraw(_id), 'POST');
    return res
  }
  @action exchange = async (_id) => {
    const res = await service.request(api.box.exchange(_id), 'POST');
    return res
  }

  @action pushExchangePromise =  (ids) => {

    let promiseList = []
    for (let i = 0; i < ids.length; i++) {
      const _id = ids[i]
      // eslint-disable-next-line no-async-promise-executor
      let newpromise = new Promise(async (resolve, reject) => {
        let listData =  await this.exchange(_id);
        resolve(listData)
      })

      promiseList.push(newpromise)
    }
    return promiseList
  }

  // -----------------------取回-回收-end-------------------------

  // -----------------------背包---------------------------

  @observable backPageData = {
    page: 0,
    limit: 12,
    total: 0,
    load: false,
    steamload: false,
  };
  @observable withdrawPageData = {
    page: 0,
    limit: 20,
    total: 0,
    load: false,
    queryGroups: ''
  };
  @observable userItemData = {
    list: []
  }
  @observable withdrawOrdersData = {
    list: []
  }
  @observable stramUserInfo = {
    steam: {
      trans_link: ''
    }
  }

  @action setStramUserInfo = (value) => {
    this.stramUserInfo = value
  }

  @action setBackData = (key, value) => {
    this.backPageData[key] = value
  }
  @action setWithdrawPageData = (key, value) => {
    this.withdrawPageData[key] = value
  }
 @action setUserItemData=(value) => {
   this.userItemData = value
 }
  @action getUserData = async (parmas) => {
    try {
      if (!parmas) {
        parmas = {
          page: this.backPageData.page,
          limit: this.backPageData.limit,
        }
      }
      this.backPageData.load = true
      const res = await service.request(api.box.getUserItemList(), 'GET', parmas);
      this.backPageData.load = false
      if (res.code === 0) {
        for (let i = 0; i < res.data.list.length; i++) {
          let goodsItem = res.data.list[i];
          goodsItem = this.formatWeapon(goodsItem)
          goodsItem['recycling'] = false
          goodsItem['backing'] = false
        }
        this.userItemData = res.data
        this.backPageData.total = Math.ceil(res.data.total / 12) * 10
        console.log('this.backPageData.total', res.data.total)
      }
    } catch (error) {
      console.log('error', error);
      this.backPageData.load = false
    }
  }

  @action getSteamUserInfo = async () => {
    this.backPageData.steamLoad = true
    const res = await service.request(api.box.getSteamUserInfo(), 'GET');
    this.backPageData.steamLoad = false
    if (res && res.code === 0) {
      this.stramUserInfo = res.data
    }
  }

  @action setUserInfo = async (parmas) => {
    this.backPageData.steamLoad = true
    const res = await service.request(api.box.setUserInfo(), 'PUT', parmas);
    this.backPageData.steamLoad = false
    return res
  }

  @action getWithdrawOrders = async (parmas) => {
    try {
      if (!parmas) {
        parmas = {
          page: this.withdrawPageData.page,
          limit: this.withdrawPageData.limit,
          queryGroups: JSON.stringify([['status', 'in', [10, 20, 30, 40]]])
        }
      }
      this.withdrawPageData.load = true
      const res = await service.request(api.box.getWithdrawOrders(), 'GET', parmas);
      this.withdrawPageData.load = false
      if (res.code === 0) {
        for (let i = 0; i < res.data.list.length; i++) {
          let goodsItem = res.data.list[i];
          goodsItem = this.formatWeapon(goodsItem)
        }
        this.withdrawOrdersData = res.data
        this.withdrawPageData.total = Math.ceil(res.data.total / 20) * 10
      }
    } catch (error) {
      console.log('error', error);
      this.withdrawPageData.load = false
    }
  }


  // -----------------------背包-end--------------------------

}

export default BoxStore
