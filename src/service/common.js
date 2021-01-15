
/**
 * 日志打印,错误提示
 * @param requestInfo
 */
const loggerWrap = (requestInfo, res) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = new Date().getTime() // 开始请求时间
    console.log(
      `${requestInfo} success, status=${res.status}   cost time = ${new Date().getTime() -
      startTime}ms`
    )
    console.log('requestData=', res)
  }
}

/**
 *
 * @param {get请求拼接参数} data
 */
const getParam = (data) => Object.entries(data)
  .map(([key, value]) =>
    `${key}=${value}` // TODO 是否得用encodeURI函数
  )
  .join('&')

/**
 *
 * @param {返回JSON格式数据} response
 */
const convertRespToJson = async (response) => {
  const res = await response.json()
  res.status = response.status
  return res
}

export default {
  loggerWrap,
  getParam,
  convertRespToJson
}
