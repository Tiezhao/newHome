import config from '@configs/config'
import { ecauth } from '@configs/storageKey'
import ldStore from '@stores/loadStore'
import storage from '@utils/storage'
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

const fetchAction = async (url, method, data, option) => {
  const bToken = await storage.get(ecauth.bToken)
  const token = await storage.get(ecauth.token)
  // const rToken = await storage.get(ecauth.rToken)
  return new Promise(function (resolve, reject) {
    if (option && option.load) {
      ldStore.setShow(false)
    } else {
      ldStore.setShow(true)
    }
    const headerParams = {}
    if (option && option.lockToken) {
      headerParams['TOKEN-LOCK'] = option.lockToken
    }
    if (option && option.getParams) {
      const callBackParams = {
        url: url,
        method: method,
        data: data,
        option: option,
        token: token
      }
      option.callBack(callBackParams)
    }
    headerParams['Content-Type'] = 'application/json'
    headerParams['Access-Control-Expose-Headers'] = 'Content-Type,token'
    headerParams['Access-Control-Allow-Headers'] = 'Content-Type,token'
    headerParams['Cache-Control'] = 'no-chache'
    // headerParams['Access-Control-Allow-Origin'] = '*'

    if (bToken) {
      headerParams.Authorization = bToken
    }

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
        // message.error('网络链接错误')
        reject(err)
      })
  })
}

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
