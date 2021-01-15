
import cookie from 'react-cookies'

class Cookies {
  set = (key, obj) => {
    cookie.save(key, obj)
  }

  get = (key) => {
    const data = cookie.load(key)
    return data
  }

  remove = (key) => {
    cookie.remove(key, { path: '/' })
  }

  getAll = () => cookie.loadAll()
}

export default new Cookies()
