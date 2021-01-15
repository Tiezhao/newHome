import history from '@router/history'
// import appStore from '@stores/appStore'
// import socketStore from '@stores/socketStore'
import { dropByCacheKey } from 'react-router-cache-route'
import storage from './storage'
const logOut = (text) => {
  try {
    console.log('logOut')
    // socketStore.logOut()
    // appStore.setAuth(false)
    dropByCacheKey()
    history.replace('/home')
    storage.clear()
  } catch (error) {
    console.log('error', error)
  }
}

class User {
  logOut = logOut
}

export default new User()
