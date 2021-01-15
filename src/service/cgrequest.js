import config from '@configs/config'
import ldStore from '@stores/loadStore'
import user from '@utils/user'
import common from './common'

const solveErrCode = async (res, params) => {
  const status = res.status

  if (status === 200) {
    const code = res.code
    switch (code) {
    case 1:
      // message.error('网络链接错误')
      return res
    case 1010:
      user.logOut()
      return res
    case 422:
      // message.error('参数错误')
      return res
    default:
      return res
    }
  } else if (status === 401) {
    user.logOut()
  } else {
    return res
  }
}
// -----------------------请求主体--------------------------------------

const fetchAction = async (url, method, data, option) => new Promise(function (resolve, reject) {
  if (option && option.load) {
    ldStore.setShow(false)
  } else {
    ldStore.setShow(true)
  }
  const headerParams = {}

  headerParams['Content-Type'] = 'application/json'
  headerParams['Access-Control-Expose-Headers'] = 'Content-Type,token'
  headerParams['Access-Control-Allow-Headers'] = 'Content-Type,token'
  headerParams['Cache-Control'] = 'no-chache'
  headerParams.Authorization = 'Bearer AcHai15BOgKM643p'

  let fetchParams
  if (method === 'GET') {
    fetchParams = {
      timeout: config.timeOut(),
      method: method,
      headers: headerParams,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // *client, no-referrer
    }
  } else {
    fetchParams = {
      timeout: config.timeOut(),
      method: method,
      headers: headerParams,
      body: data,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // *client, no-referrer
    }
  }
  fetch(url, fetchParams)
    .then(common.convertRespToJson)
    .then((res) => {
      ldStore.setShow(false)
      resolve(res)
    })
    .catch((err) => {
      ldStore.setShow(false)
      reject(err)
    })
})

// -------------------------------暴露接口---------------------------------------------

const request = async (path, method, data, option) => {
  try {
    let url = path
    let jsonData
    if (method === 'GET') {
      if (data) {
        url += `?${common.getParam(data)}`
      } else {
        jsonData = null
      }
    } else {
      jsonData = JSON.stringify(data)
    }
    jsonData = JSON.stringify(data)

    const res = await fetchAction(url, method, jsonData, option)
    const params = {
      url: url,
      method: method,
      jsonData: jsonData,
      option: option
    }

    return solveErrCode(res, params)
  } catch (error) {
    console.log('error', error)
  }
}

export default {
  request
}
