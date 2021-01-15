
import React, { useState, useEffect} from 'react'
import './index.less'
import {observer, inject} from 'mobx-react'
import {  Layout, Menu} from 'antd';
import PropTypes from 'prop-types'
import CenterRouter from '@router/centerRouter';
import { useHistory} from 'react-router-dom';
function Center ({ appStore,  centerStore}) {
  const history = useHistory()
  const { isAuth, boxStore, teamStore} = appStore
  const  sliderList = [
    { title: '充值',     key: 'charge' },
    { title: '我的背包',  key: 'backpack'},
    { title: '取回中心',  key: 'retrieve'},
    { title: '我的推广',  key: 'promotion' },
    { title: '个人中心',  key: 'profile' },
  ]

  const { Content, Sider } = Layout;
  const {getSteamUserInfo} = boxStore
  const {  getDetail} = teamStore
  const {centerType, setCenterType} = centerStore

  console.log('centerType', centerType);
  useEffect(() => {

    if (!isAuth) {
      history.replace('/')
    } else {
      getSteamUserInfo()
      getDetail()
    }


  }, [isAuth])


  const handleChangeChannel = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    setCenterType(key)
    switch (key) {
    case 'charge':
      history.push('/home/center/charge')
      break;
    case 'backpack':
      history.push('/home/center/backpack')
      break;
    case 'retrieve':
      history.push('/home/center/retrieve')
      break;
    case 'promotion':
      history.push('/home/center/promotion')
      break;
    case 'profile':
      history.push('/home/center/profile')
      break;
    default:
      break;
    }

  }

  const Slider = () => (
    <Sider>
      <Menu
        mode='inline'
        defaultSelectedKeys={[centerType]}
        selectedKeys={[centerType]}
        style={{ height: '100%' }}
        onSelect={handleChangeChannel}
      >
        {
          sliderList.map((info, i) => (
            <Menu.Item
              key={info.key}>
              <div>
                <span>{info.title}</span>
              </div>
            </Menu.Item>
          ))
        }
      </Menu>
    </Sider>
  )


  return (
    <div className='center-layout'>
      <div className='center-layout-box'>
        <Layout >
          <Slider />
          <Content>
            <CenterRouter />
          </Content>
        </Layout>
      </div>
    </div>
  );
}
Center.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore', 'centerStore')(observer(Center));

