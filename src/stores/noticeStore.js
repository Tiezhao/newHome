import { action, observable, toJS} from 'mobx'
import api from '@configs/api'
import service from '@service'
import methods from '@utils/methods'

class NoticeStore {

  @observable noticeData = {
    list: []
  }
  @observable parmas = {
    page: 0,
    limit: 10
  }
  @action getNoticeData = async () => {
    try {
      const res = await service.request(api.notice.getNotice(), 'GET', this.parmas);
      if (res.code === 0) {
        this.noticeData = res.data
        // for (let i = 0; i < res.data.list.length; i++) {
        //   let myData = res.data.list[i];
        //   console.log(' myData', toJS(myData))
        // }
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default NoticeStore
