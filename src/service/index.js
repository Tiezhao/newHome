
import ecrequest from './ecrequest'
import cgconfig from './cgrequest'
import appStore from '@stores/appStore'
import history from '@router/history';
const request = (path, method, data, option) => {
  if (appStore.configInfo.enable) {
    history.push('/auth')
    return
  }
  if (path.indexOf('cog') !== -1) {
    return cgconfig.request(path, method, data, option)
  } else {
    return ecrequest.request(path, method, data, option)
  }
}

export default {
  request
}
