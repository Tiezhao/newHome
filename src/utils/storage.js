class Storage {

  /**
   * 保存
   *
   * @export
   * @param {*} key
   * @param {*} value
   * @param {*} time 时间：单位【分】
   */
  set = (key, value, time) => {
    if (time) {
      time = Date.now() + 1000 * 60 * time
      localStorage.setItem(key, value, time)
    } else {
      localStorage.setItem(key, value)
    }
  }

  /**
   * 读取
   *
   * @export
   * @param {*} key
   */
  get = (key) => localStorage.getItem(key)

  remove = (key) => {
    localStorage.removeItem(key)
  }

  /**
   * !! 清空所有的存储数据
   */
  clear = () => {
    localStorage.clear()
  }
}

export default new Storage()
