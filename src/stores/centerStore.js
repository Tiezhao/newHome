import {
  action,
  observable
} from 'mobx'


class CenterStore {


  @observable centerType = 'charge'

  @action setCenterType = (value) => {

    this.centerType = value
  }


}
export default new CenterStore()
