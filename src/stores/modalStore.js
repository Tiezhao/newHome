import { action, autorun, observable } from 'mobx'
import appStore from './appStore'

class ModalStore {

  @observable authType = 'login'

  @observable showAuth = false;

  @observable showRetrieve = false
  @observable showService= false
  @observable showLimit= false
  @observable redEnvelopeType = 'receive'
  @action setShowRetrieve = (value) => {
    this.showRetrieve = value
  }

  @action setShowAuth = (value) => {
    this.showAuth = value;
  };
  @action setAuthType = (value) => {
    this.authType = value;
  };
  @action setRedEnvelopeType = (value) => {
    this.redEnvelopeType = value;
  };
  @action setShowService = (value) => {
    this.showService = value;
  };
  @action setShowLimit = (value) => {
    this.showLimit = value;
  };
}

export default ModalStore
