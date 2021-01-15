
import api from '@configs/api'
import service from '@service'
import { action, autorun, observable } from 'mobx'


class TeamStore {

  constructor (appStore) {
    this.appStore = appStore
    autorun(() => {
      if (!this.appStore.isAuth) {
        this.initData()
      }
    })
  }
  @observable detailData = {
    fixed_code: '',
    promoter_gift_pct: 0,
    sales_code: '',
    level: 1,
    refer_num: 0,
    transfer_amount_total: 0,
    income_amount_total: 0,
    income_amount_count: 0

  }

  @observable commissionPage = {
    page: 0,
    limit: 10,
    queryGroup: '[["comm_type","eq",101]]'
  }

  @action setCommissionPage = (key, value) => {
    this.commissionPage[key] = value
  }

  @observable commisstionData = {
    list: []
  }

  @observable teamData = {
    list: []
  }

  @action initData = () => {
    this.detailData = {
      fixed_code: '',
      promoter_gift_pct: 0,
      sales_code: '',
      level: 1,
      refer_num: 0,
      transfer_amount_total: 0,
      income_amount_total: 0,
      income_amount_count: 0
    }

    this.teamData = {
      list: []
    }
  }

  @action getDetail = async () => {
    const res = await service.request(api.promotion.getDetail(), 'GET')
    if (res && res.data) {
      this.detailData = res.data
    }
  }

  @action setTeamData = (value) => {
    this.teamData = value
  }

  @action receiveIncome = async () => {
    const res = await service.request(api.promotion.receiveIncome(), 'POST')
    return res
  }

  @action getTeamData = async (obj) => {
    const res = await service.request(api.promotion.getTeam(), 'GET', obj)
    return res
  }

  @action getCommission = async () => {
    const res = await service.request(api.promotion.getCommission(), 'GET', this.commissionPage)
    if (res && res.code === 0) {
      if (res.data.list.length > 0) {
        for (let i = 0; i < res.data.list.length; i++) {
          const item = res.data.list[i];
          if (item.nickname.length > 6) {
            item.nickname = item.nickname.substring(0, 6)
            item.nickname = `${item.nickname}...`
          }
        }
      }
      this.commisstionData = res.data
    }
  }
}

export default TeamStore
