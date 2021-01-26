
import React, { useState, useContext } from 'react'
import './index.less'
import { Button, Col, Dropdown, Icon, Layout, Menu, Row, Tooltip } from 'antd'
import { useHistory, NavLink} from 'react-router-dom';
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import methods from '@utils/methods'
import img from '@utils/img'
import Avatar from '@components/Avatar'
import { DownOutlined } from '@ant-design/icons';

function Header ({ appStore, centerStore }) {
  const history = useHistory()
  const { isAuth, walletInfo, userInfo, logout, modalStore} = appStore
  const {  setShowAuth, setAuthType} = modalStore
  const { setCenterType} = centerStore

  const balance = methods.MoneySlice(walletInfo.balance, false)

  let nickName = userInfo.nickname ? userInfo.nickname : ''
  if (nickName.length > 10) {
    nickName = nickName.substring(0, 10)
    nickName = `${nickName}...`
  }
  const headerList = [
    { title: 'CSGO开箱',  to: '/home/boxhome', key: 'boxhome'},
    { title: '斗箱大厅',  to: '/home/doubox', key: 'doubox'},
    { title: '推广',  to: '/home/center/promotion', key: 'promotion'},
    { title: '我的背包',  to: '/home/center/backpack', key: 'backpack'},
    { title: '充值',  to: '/home/center/charge', key: 'charge'}
    // { title: 'ROLL房',  to: '/home/roll', key: 'roll'},
  ];

  const handleModal  = (type) => {
    try {
      if (type === 1) {
        setAuthType('login')
      } else  if (type === 2) {
        setAuthType('reg')
      }
      setShowAuth(true)
    } catch (error) {
      console.log('error', error);
    }
  }
  const handleMenu = (val) => {
    switch (val.key) {
    case '0':
      history.push('/home/center/charge')
      setCenterType('charge')
      break;
    case '1':
      history.push('/home/center/profile')
      setCenterType('profile')
      break;
    case '2':
      history.push('/home/center/backpack')
      setCenterType('backpack')
      break;
    case '3':
      logout()
      break;
    default:
      break;
    }
  }

  const handleClick = (item) => {
    // console.log('itemto:', item.to)
    const path = item.to
    const key = item.key
    if (path) {
      if (key === 'promotion') {
        if (isAuth) {
          setCenterType('promotion')

          history.push(path)
        } else {
          setShowAuth(true)
        }
      } else if (key === 'roll') {
        if (isAuth) {
          history.push(path)
        } else {
          setShowAuth(true)
        }
      } else {
        history.push(path)
      }

    }


  };


  const NoLogin = () => (
    <Col span={4} className='layout-col-center'>
      <div className='group-btn'>
        <div className='login-btn'   onClick={() => {
          handleModal(1)
        }}  />
        <div className="left-reg"></div>
        <Button
          id='register'
          className='reg-btn' onClick={() => {
            handleModal(2)
          }} type='primary'
        >注册
        </Button>
        <div className="right-reg"></div>
      </div>
    </Col>
  )

  const MenuDown = () => (
    <Menu >
      <Menu.Item key='0' onClick={handleMenu}>
        充值
      </Menu.Item>
      <Menu.Item key='1' onClick={handleMenu}>
        个人中心
      </Menu.Item>
      <Menu.Item key='2' onClick={handleMenu}>
        我的背包
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='3' onClick={handleMenu} >
          注销
      </Menu.Item>
    </Menu>
  )


  const Login = () => (
    <Col span={3}>
      <Dropdown  trigger={['click', 'hover']} overlay={<MenuDown />} >
        <div className='info-box' >
          <div className='info-img'>
            <Avatar avatarStyle={'nav-style'}   />
          </div>
          {/* <Dropdown   overlay={<MenuDown />} > */}
          <div className='info-item'>
            <p>{nickName}</p>
            <p><span>余额: </span>{String(balance)}</p>
          </div>
          {/* </Dropdown> */}
          <a onClick={(e) => e.preventDefault()}>
            <DownOutlined />
          </a>
        </div>
      </Dropdown>
    </Col>
  )

  const Nav = () => (
    <Col span={18}>
      <div className='layout-header-box'>
        <a>
          <img
            onClick={() => {
              history.push('/home/openbox')
            }}
            src={img.icon_logo} />
        </a>
        <Menu
          defaultSelectedKeys={['0']}
          mode="horizontal"
        >
          {headerList.map((item, i) => (
            i == 4 ? <Menu.Item key={i} onClick={() => {handleClick(item)}}>
              <div className='header-menu-item'>
                <p>
                  <Tooltip placement="rightBottom" title="首冲100 送13" color="green">
                    {item.title}
                  </Tooltip>
                </p>
              </div>
            </Menu.Item>
              : <Menu.Item key={i} onClick={() => {handleClick(item)}}>
                <div className='header-menu-item'>
                  <p>{item.title}</p>
                </div>
              </Menu.Item>
          ))}
        </Menu>
      </div>
    </Col>
  )


  return (
    <Layout.Header >
      <div className='layout-header'>
        <Row
          type='flex'
          justify='space-between'
        >
          <Nav />
          {isAuth ? <Login /> : <NoLogin />}
        </Row>
      </div>
    </Layout.Header>
  );
}
Header.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore',  'centerStore')(observer(Header));
