/* eslint-disable camelcase */
// 由于引入了appStore 的数据,不要在appStore 引入任何在socketStore写入数据的store, 否则会引起死锁
import api from '@configs/api'
import config from '@configs/config'
import { ecauth } from '@configs/storageKey'
import service from '@service'
import methods from '@utils/methods'
import socket from '@utils/socket'
import storage from '@utils/storage'
import { action, observable } from 'mobx'
import history from '@router/history';
import { getQualityMap } from '@assets/data/boxenum/quality';
class SocketStore {

  constructor (appStore) {
    this.show = false
    this.appStore = appStore
  }

  @observable roomList = ['csbbg'];

  @observable clientData = '';

  @observable mySocket = '';

  // 系统维护
  @observable configInfo = {
    enable: false,
    remark: '系统维护中, 敬请期待'
  }

  @action getClientData = async () => {

    const webInfo = methods.getBrowser();
    const option = {
      system: 'web',
      system_version: webInfo[0] + webInfo[1]
    };
    const res = await service.request(api.socket.getClient(), 'POST', option);
    return res;
  };

  @action socketIo = async (auth) => {
    const res = await this.getClientData();
    if (res && res.code === 0) {
      const options = {
        query: { client_id: res.data.client_id },
        path: '/sot/socket.io'
      };
      this.clientData = res.data;
      storage.set(ecauth.clientId, res.data.client_id);
      this.mySocket = await socket.register(config.sockIoUrl(), options);
      if (this.mySocket) {
        this.linstSocket(auth);
      }
    }
  };

  @action linstSocket = (auth) => {
    this.mySocket.on('push', (res) => {
      this.dealAction(res.extras);
    });

    this.mySocket.on('connect', () => {
      this.jionRoom();
      if (auth) {
        this.login();
      }
      console.log('socket connect');
    });

    this.mySocket.on('disconnect', () => {
      console.log('socket disconnect');
    });
    this.mySocket.on('disconnecting', () => {
      console.log('socket disconnecting');
    });
    this.mySocket.on('error', (error) => {
      console.log('socket error', error);
    });

    this.mySocket.on('join_chat_success', (args) => {
      console.log('join_chat_success=====', args)
      this.joinRoomData = args
    })

    this.mySocket.on('leave_chat_success', (args) => {
      // this.handLeaveRoomData(args)
      console.log('leave_chat_success=====', args)
      this.leaveRoomData = args
    })
  };

  @action jionRoom = () => {
    for (let i = 0; i < this.roomList.length; i++) {
      let room = this.roomList[i];
      switch (process.env.REACT_APP_ENV) {
      case 'dev':
        room = room + '_sit'
        break;
      case 'sit':
        room = room + '_sit'
        break;
      case 'pre':
        room = room + '_pre'
        break;
      case 'pro':
        room = room + '_prod'
        break;
      case 'cswin':
        room = room + '_prod'
        break;
      default:
        break;
      }

      this.mySocket.emit('join', {
        room
      });
    }
  };


  @action login = async () => {
    if (!methods.checkNullObj(this.clientData)) {return;}
    const token = await storage.get(ecauth.token);
    if (token) {
      this.mySocket.emit('login', {
        token: token,
        client_id: this.clientData.client_id
      });
      console.log('socket login');
    }
  };

  @action logOut = async () => {
    if (!methods.checkNullObj(this.clientData)) {return;}
    const token = await storage.get(ecauth.token);
    if (token) {
      this.mySocket.emit('logout', {
        token: token,
        client_id: this.clientData.client_id
      });
      console.log('socket logOut');
    }
  };

  @action dealAction = async (result) => {
    try {
      console.log('history', history);
      const pathName =  history.location.pathname
      const data = result;
      // 充值成功
      if (data.type === 51) {
        if (data.amount) {
          this.appStore.refreshWalletInfo()
        }
      } else if (data.type === 60) {
        // 紧急维护
        this.appStore.configInfo = data.confs.value.site_maintenance
        if (data.confs.value.site_maintenance.enable) {
          history.push('/auth')
        } else {
          history.push('/')
        }
      } else if (data.type === 1513) {

        if (pathName.indexOf('doubox') !== -1 || pathName.indexOf('createdou') !== -1 || pathName.indexOf('douopen') !== -1) {
          console.log('创建房间的推送', data);
          this.appStore.douStore.unShiftRoomList(data)
        }

      } else if (data.type === 1514) {
        if (pathName.indexOf('doubox') !== -1 || pathName.indexOf('createdou') !== -1 || pathName.indexOf('douopen') !== -1) {
          console.log('加入房间推送', data);
          this.appStore.douStore.updateRoomList(data)
          this.appStore.douStore.updateRoomDetail(data)
        }
      } else if (data.type === 1515) {
        if (pathName.indexOf('doubox') !== -1 || pathName.indexOf('createdou') !== -1 || pathName.indexOf('douopen') !== -1) {
          console.log('游戏开始推送========>', data);
          this.appStore.douStore.getRoomDetail(data.room_detail)
          this.appStore.douStore.updateRoomList(data)
        }
      } else if (data.type === 1516) {
        if (pathName.indexOf('doubox') !== -1 || pathName.indexOf('createdou') !== -1 || pathName.indexOf('douopen') !== -1) {
          console.log('开箱步骤推送========>', data);
          this.appStore.douStore.updateRoomDetail(data)
        }

      } else if (data.type === 1517) {
        if (pathName.indexOf('doubox') !== -1 || pathName.indexOf('createdou') !== -1 || pathName.indexOf('douopen') !== -1) {
          console.log('关闭房间推送========>', data);
          this.appStore.douStore.updateRoomList(data)
        }

      } else if (data.type === 84101001) {
        console.log('steam确认收货推送========>', data);
        this.appStore.boxStore.getWithdrawOrders()
        this.appStore.modalStore.setShowRetrieve(true)
      } else if (data.type === 84101002) {
        console.log('steam确认收货推送========>', data);
        this.appStore.boxStore.getWithdrawOrders()
        this.appStore.modalStore.setShowRetrieve(true)
      }  else if (data.type === 84101211) {
        if (history.location.pathname.indexOf('boxhome') !== -1) {
          console.log('开箱历史记录推送========>', data);
          for (let i = 0; i < data.unbox_items.length; i++) {
            const unboxItem = data.unbox_items[i];
            let item = data.items.find((e) => e._id  === unboxItem.item_id)
            if (item) {
              console.log('item', item);
              let nameObj = this.appStore.boxStore.formatName(item.item_name)
              let newAdd = {
                user_item_id: unboxItem.user_item_id,
                item_detail: item,
                user_datail: data.user_detail,
                user_id: data.user_id,
                $firstTypename: nameObj.$firstTypename,
                $firstname: nameObj.$firstname,
                $threename: nameObj.$threename,
                $twoname: nameObj.$twoname,
                $rarityBgClass: item.$rarityBgClass = getQualityMap(item.extends.quality || 'Rarity_Common_Weapon').bgClass
              }
              console.log('newAdd', newAdd);
              this.appStore.boxStore.addOne(newAdd)
            }
          }
        }
      } else if (data.type === 84101201) {
        if (history.location.pathname.indexOf('boxhome') !== -1) {
          console.log('箱子变动推送========>', data);
          this.appStore.boxStore.getAllTypeBoxs()

        }

      }
    } catch (error) {
      console.log('err11', error);
    }
  };
}

export default  SocketStore
