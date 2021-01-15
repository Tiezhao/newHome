// hack，在组件外部使用导航
// 5.0以上版本会push 后页面无刷新，降至5.0.0一下版本正常

const createHistory = require('history').createBrowserHistory

export default createHistory()
