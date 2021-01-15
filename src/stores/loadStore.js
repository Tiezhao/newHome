import { action, autorun, observable } from 'mobx'


class LoadStore {
  constructor () {
    this.show = false

  }
  @observable show = false;


  @action initData = () => {
    this.show = false
  }


  @action setShow = (value) => {
    this.show = value
  }
}

export default new LoadStore()
