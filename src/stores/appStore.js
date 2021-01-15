import api from '@configs/api'
import { ecauth } from '@configs/storageKey'
import { action, autorun,  observable } from 'mobx'
import service from '@service'
import cookies from '@utils/cookies'
import history from '@router/history';
import storage from '@utils/storage'
import SocketStore from './socketStore'
import ActivityStore from './activityStore'
import NoticeStore from './noticeStore'
import WalletStore from './walletStore'
import DouStore from './douStore'
import TeamStore from './teamStore'
import BoxStore from './boxStore'
import ModalStore from './modalStore'
import { dropByCacheKey } from 'react-router-cache-route'
class AppStore {
  constructor () {
    this.activityStore = new ActivityStore(this)
    this.walletStore = new WalletStore(this)
    this.teamStore = new TeamStore(this)
    this.douStore = new DouStore(this)
    this.boxStore = new BoxStore(this)
    this.noticeStore = new NoticeStore(this)
    this.modalStore = new ModalStore(this)
    this.socketStore = new SocketStore(this)
    autorun(() => {
      if (!this.isAuth) {
        this.initData()
        this.initAccountData()
      }
    })
  }


  @observable configInfo = {
    enable: false,
    remark: '系统维护中..'
  }


  @observable isAuth = false


  @observable stramUserInfo = {
    steam: {
      trans_link: ''
    }
  }

  @action initData = () => {
    this.isAuth = false
  }


  @action getConfig = () => new Promise((resolve, reject) => {
    let queryGroup = ''
    if (process.env.REACT_APP_ENV === 'dev' || process.env.REACT_APP_ENV === 'sit') {
      queryGroup = JSON.stringify([['storage_id', 'eq', 'cccccccccccccccccc018120'], ['data_querys', 'in', [{ id: 'cccccccccccccc018120cc00' }]]])
    } else if (process.env.REACT_APP_ENV === 'pre') {
      queryGroup = JSON.stringify([['storage_id', 'eq', 'cccccccccccccccccc028120'], ['data_querys', 'in', [{ id: 'cccccccccccccc028120cc00' }]]])
    } else if (process.env.REACT_APP_ENV === 'pro' || process.env.REACT_APP_ENV === 'cswin') {
      queryGroup = JSON.stringify([['storage_id', 'eq', 'cccccccccccccccccc038120'], ['data_querys', 'in', [{ id: 'cccccccccccccc038120cc00' }]]])
    }

    const params = {
      page: 0,
      limit: 20,
      queryGroup: queryGroup
    }
    const res = service.request(api.config.getConfig(), 'GET', params)
    resolve(res)
  })

  @action initApp = async () => {
    console.log('initApp')

    Promise.resolve().then(() => this.getConfig())
      .then((res) => {
        console.log('res111', res);
        if (res && res.code === 0) {
          const item = res.data.list.find(
            (e) => e.key === 'common'
          );
          if (item) {
            if (item.value.site_maintenance.enable) {
              this.configInfo = item.value.site_maintenance
              history.push('/auth')
            }
          }
        }
        this.checkoutAuth()
      })
  }

  @action checkoutAuth = async () => {
    const cookiesToken = await cookies.get('token')
    console.log('cookiesToken', cookiesToken);
    const rToken = await storage.get(ecauth.rToken)
    if (cookiesToken) {
      // steam登陆获取令牌方式
      const cookiesBearertToken = cookies.get('type') + ' ' + cookiesToken
      const cookiesRefreshToken = cookies.get('refresh_token')
      storage.set(ecauth.token, cookiesToken)
      storage.set(ecauth.bToken, cookiesBearertToken)
      storage.set(ecauth.rToken, cookiesRefreshToken)
      this.setAuth(true)
      this.socketStore.socketIo(true)
      this.getUserInfoAndWalletInfo()
      cookies.remove('type')
      cookies.remove('token')
      cookies.remove('refresh_token')
      cookies.remove('expires')
    } else if (rToken) {
      const refreshData = await this.refreshToken(rToken)
      if (refreshData && refreshData.code === 0) {
        const bearertToken = refreshData.data.type + ' ' + refreshData.data.token
        const token = refreshData.data.token
        const refreshToken = refreshData.data.refresh_token
        storage.set(ecauth.token, token)
        storage.set(ecauth.bToken, bearertToken)
        storage.set(ecauth.rToken, refreshToken)
        this.getUserInfoAndWalletInfo()
        this.setAuth(true)
        this.socketStore.socketIo(true)
      } else {
        this.socketStore.socketIo(false)
      }
    } else {
      this.socketStore.socketIo(false)
      console.log('未登陆状态');
    }
  }

  @action refreshToken = async (rToken) => {
    const params = {
      refresh_token: rToken
    }
    const res = await service.request(api.user.refreshToken(), 'PUT', params)
    return res
  }

  @action setAuth = (value) => {
    this.isAuth = value
  }

  @action tokenLock = async (params) => {
    const res = await service.request(api.wallet.lock(), 'POST', params)
    return res
  }

  // -----------------------------------------用户信息--------------------------------
  @observable userInfo = {
    _id: ''
  };


  @observable loginInfo = {};

  @observable walletInfo = {
    balance: 0
  };
  @observable walletConfig = {
    CNY: 1,
    CNY_FIXED: 1
  }

  @action initAccountData = () => {
    this.loginInfo = {}
    this.userInfo = {}
    this.walletInfo = {
      balance: 0
    };
  }

  @action getWalletConfig = async () => {
    const res = await service.request(api.wallet.getConfig(), 'GET');
    return res;
  }


  @action getUserInfoAndWalletInfo = () => {
    try {
      Promise.resolve().then(() => this.getUserInfo())
        .then((userinfo) => {
          if (userinfo && userinfo.code === 0) {
            this.setUserInfo(userinfo.data)
            return this.getWalletInfo(userinfo.data.related_ids.wallet_id)
          }
        })
        .then((walletinfo) => {
          if (walletinfo && walletinfo.code === 0) {
            this.setWalletInfo(walletinfo.data)
            if (!walletinfo.data.last_recharge_time) {
              if (this.activityStore) {
                // this.activityStore.autoGetTask()
              }
            }
            return this.getWalletConfig()
          }
        })
        .then((config) => {
          if (config && config.code === 0) {
            this.walletConfig = config.data
          }
        })

    } catch (error) {
      console.log('error', error);
    }
  };

  @action getWalletInfo = async (_id) => {
    const res = await service.request(api.wallet.getWalletInfo(_id), 'GET');
    return res;
  };


  @action refreshWalletInfo = async () => {
    try {
      const res = await this.getWalletInfo(this.userInfo.related_ids.wallet_id);
      if (res && res.code === 0) {
        this.walletInfo = res.data;
      }
    } catch (error) {
      console.log('error', error);
    }

  };


  @action setWalletInfo = (value) => {
    this.walletInfo = value;
  };


  @action login = async (obj) => {
    const res = await service.request(api.user.login(), 'PUT', obj);
    return res;
  };

  @action setLoginInfo = (value) => {
    this.loginInfo = value;
  };

  @action getUserInfo = async (obj) => {
    const res = await service.request(api.user.getUserInfo(), 'GET');
    return res;
  };

  @action refreshUserInfo = async () => {
    const res = await service.request(api.user.getUserInfo(), 'GET');
    if (res && res.code === 0) {
      this.userInfo = res.data;
    }
  };

  @action setUserInfo = (value) => {
    this.userInfo = value;
  };


  @action register = (obj, type) => {
    if (type === 1) {
      const res = service.request(api.user.register(), 'POST', obj);
      return res;
    } else if (type === 2) {
      const res = service.request(api.user.forget(), 'PUT', obj);
      return res;
    }
  };

  @action logout = async () => {
    try {
      await service.request(api.user.logout(), 'DELETE');
      storage.clear();
      this.setAuth(false)
      dropByCacheKey()
      this.socketStore.logOut()
      history.replace('/');
    } catch (error) {
      console.log('error', error);
    }
  };

  @action getCode = async (type, email) => {
    if (type === 1) {
      // 注册
      const parmas = {
        key: email,
        ways: 1,
      };
      const res = await service.request(
        api.user.getRegisterCode(),
        'POST',
        parmas
      );
      return res;
    } else if (type === 2) {
      const parmas = {
        key: email,
        ways: 1,
      };
      const res = await service.request(
        api.user.getForgetCode(),
        'POST',
        parmas
      );
      return res;
    }
  };

  @action updateUserInfo = async (obj) => {
    const res = await service.request(api.user.updateInfo(), 'PUT', obj);
    return res;
  };


  // --------------------------------------------------------------------------------


}

export default new AppStore()
