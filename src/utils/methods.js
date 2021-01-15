

// 类型判断
function type (target) {
  let ret = typeof (target)
  let template = {
    '[object Array]': 'array',
    '[object Object]': 'object',
    '[object Number]': 'number - object',
    '[object Boolean]': 'boolean - object',
    '[object String]': 'string-object'
  }

  if (target === null) {
    return 'null'
  } else if (ret === 'object') {
    let str = Object.prototype.toString.call(target)
    return template[str]
  } else {
    return ret
  }
}

function getBrowser () {
  let browser = {
    msie: false,
    firefox: false,
    opera: false,
    safari: false,
    chrome: false,
    netscape: false,
    appname: 'unknown',
    version: 0
  }
  let ua = window.navigator.userAgent.toLowerCase()
  if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
    browser[RegExp.$1] = true
    browser.appname = RegExp.$1
    browser.version = RegExp.$2
  } else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
    // safari
    browser.safari = true
    browser.appname = 'safari'
    browser.version = RegExp.$2
  }
  return [browser.appname, browser.version]
}

// 数组去重
function MergeArray (arr1, arr2) {
  let _arr = []
  for (let i = 0; i < arr1.length; i++) {
    _arr.push(arr1[i])
  }
  for (let k = 0; k < arr2.length; k++) {
    let flag = true
    for (let j = 0; j < arr1.length; j++) {
      // eslint-disable-next-line no-undef
      if (arr2[i] === arr1[j]) {
        flag = false
        break
      }
    }
    if (flag) {
      // eslint-disable-next-line no-undef
      _arr.push(arr2[i])
    }
  }
  return _arr
}

// 时间戳转天时分秒
function formatDuring (mss) {
  let days = parseInt(mss / (1000 * 60 * 60 * 24))
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + (days * 24))
  return hours + '小时'
}

/**
 * 浮点数截取
 * @param value 数值
 * @param n 截取尾数
 * @param isRounding 是否四舍五入
 */
function FloatSlice (value, n, isRounding = true) {
  let ret
  const pow = Math.pow(10, n)
  if (isRounding) {
    ret = Math.round(value * pow) / pow
  } else {
    ret = Math.floor(value * pow) / pow
  }
  return ret
}

/**
 * 元转分，分转元
 * @param value 数值
 * @param ascending  true 元转分，false 分转元
 */
function MoneySlice (value, switchFen = false, isRounding = true, decimals = 2) {
  let ret
  if (switchFen) {
    ret = value * 100
  } else {
    ret = value / 100
  }
  return FloatSlice(ret, decimals, isRounding)
}

function millionSlice (value) {
  const ret = value / 1000000
  return ret
}

// 判断对象是否为空
function checkNullObj (obj) {
  if (Object.keys(obj).length === 0) {
    return false // 如果为空,返回false
  }
  return true // 如果不为空，则会执行到这一步，返回true
}

// 十六进制颜色随机
function color16 () {
  let r = Math.floor(Math.random() * 256)
  let g = Math.floor(Math.random() * 256)
  let b = Math.floor(Math.random() * 256)
  let color = '#' + r.toString(16) + g.toString(16) + b.toString(16)
  return color
}

// 给数字加，号，千位
function toThousands (num) {
  num = (num || 0).toString()
  let result = ''
  while (num.length > 3) {
    result = ', ' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {result = num + result}
  return result
}

// 数组从大到小排序 arr 数组 key 要判断的键
function getMaxSort (arr, key) {
  let max
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i][key] < arr[j][key]) {
        max = arr[j]
        arr[j] = arr[i]
        arr[i] = max
      }
    }
  }
  return arr
}
// 数组从小到大排序 arr 数组 key 要判断的键
function getMinSort (arr, key) {
  let  min
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i][key] > arr[j][key]) {
        min = arr[j]
        arr[j] = arr[i]
        arr[i] =  min
      }
    }
  }
  return arr
}
// 数组升序
function compare (value1, value2) {
  if (value1 > value2) {
    return 1
  } else if (value1 < value2) {
    return -1
  } else {
    return 0
  }
}

function testPhone () {
  const myreg = /^[1](3|4|5|6|7|8|9)[0-9]\d{8}$/;

  return myreg
}

function testEmail () {
  const myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

  return myreg
}


function formatThousand (num) {
  let reg = /\d{1,3}(?=(\d{3})+$)/g
  return (num + '').replace(reg, '$&,')
}


//  函数去抖
function debounce (func, wait = 1000) {
  let timer;
  return function () {
    // eslint-disable-next-line consistent-this
    const that = func;
    let args = arguments; // arguments中存着e

    if (timer) {clearTimeout(timer);}

    let callNow = !timer;

    timer = setTimeout(() => {
      timer = null;
    }, wait)

    if (callNow) {func.apply(that, args);}
  }
}

// 格式化时间
function formatDate (fmt = 'YYYY-mm-dd ', date = new Date()) {
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  let ret;
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return fmt;
}
// 获取二级目录名称
function getPageSecond (props) {
  let path = props.match.path;
  if (path.startsWith('/')) {
    path = path.substring(1, path.length);
  }
  path = path.split('/')
  if (path.length > 1) {
    return path[1]
  } else {
    return ''
  }
}

function delay (time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

// 生成从minNum到maxNum的随机数
function randomNum (minNum, maxNum) {
  switch (arguments.length) {
  case 1:
    return parseInt(Math.random() * minNum + 1, 10);
  case 2:
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  default:
    return 0;
  }
}

function randomString (len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

// 时区时间获取
function getLocalTime (i) {
  if (typeof i !== 'number') {return;}
  let d = new Date();
  let len = d.getTime();
  let offset = d.getTimezoneOffset() * 60000;
  let utcTime = len + offset;
  return new Date(utcTime + 3600000 * i);
}
//
function group (array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}

export default {
  type, MergeArray, formatDuring,
  FloatSlice,
  MoneySlice,
  checkNullObj,
  compare,
  testPhone,
  testEmail,
  toThousands,
  formatThousand,
  debounce,
  getMaxSort,
  getMinSort,
  color16,
  getBrowser,
  formatDate,
  getPageSecond,
  delay,
  millionSlice,
  randomNum,
  getLocalTime,
  randomString,
  group
};
