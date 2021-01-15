
import React from 'react'
import Loadable from 'react-loadable'
import img from '@utils/img'
// react-loadable实现代码分割成chunk，按需加载(路由懒加载)
const lazy = (loader) => Loadable({
  loader,
  // eslint-disable-next-line react/display-name
  loading: () => <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={img.icon_logo}  /></div>,

})

export default lazy
