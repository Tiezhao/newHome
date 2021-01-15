
import React, { useState, useEffect, useRef } from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'
import { Col,  Layout, Menu, Row, Pagination, Spin, Button } from 'antd';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import dealErrCode from '@utils/dealErrCode'
import moment from 'moment';
import img from '@utils/img'

import EmptyData from '@components/EmptyData';
function Retrieve ({ appStore, centerStore }) {
  let history = useHistory()

  const { isAuth, setAuth, boxStore, refreshWalletInfo, modalStore} = appStore
  const { setShowService} = modalStore
  const {
    getWithdrawOrders,
    withdrawPageData,
    setWithdrawPageData,
    withdrawOrdersData,
    withdraw
  } = boxStore
  const { centerType, setCenterType } = centerStore
  const { page, limit, load, total} = withdrawPageData

  const sliderList = [
    { title: '取回中', key: 'backpack'},
    { title: '历史取回', key: 'history'},
  ];

  useEffect(() => {
    const parmas = {
      page: page,
      limit: limit,
      queryGroups: JSON.stringify([
        ['status', 'in', [10, 20, 30, 40]]
      ])
    }
    getWithdrawOrders(parmas)
  }, [centerType]);

  const  [sliderType, setSliderType] =  useState('backpack');

  const handleChangeChannel = ({ item, key, keyPath, selectedKeys, selectedvals, domEvent }) => {
    setSliderType(key)

    let params = {}
    if (key === 'backpack') {
      params = {
        page: page,
        limit: limit,
        queryGroups: JSON.stringify([['status', 'in', [10, 20, 30, 40]]])
      }
    } else if (key === 'history') {
      params = {
        page: page,
        limit: limit,
        queryGroups: JSON.stringify([['status', 'eq', 1]])
      }
    }


    getWithdrawOrders(params)
  }


  const pageChange = (val) => {
    setWithdrawPageData('page', val - 1)
    let params = {
      page: val - 1,
      limit: limit
    }

    getWithdrawOrders(params)
  }


  const Header = () => (
    <Layout.Header>
      <Row type='flex' justify='space-between'>
        <Col span={18}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['retrieve']}
            selectedKeys={[sliderType]}
            onSelect={handleChangeChannel} >
            {
              sliderList.map((info, i) => (
                <Menu.Item
                  key={info.key}>
                  {info.title}
                </Menu.Item>
              ))
            }
          </Menu>
        </Col>
        <Col span={4}>
          <a className='retrieve-header-custom' onClick={handleSerive}>取回不了？请联系客服</a>
        </Col>
      </Row>
    </Layout.Header>
  )


  const statusStr = (statue) => {
    switch (statue) {
    case 0:
      return '已失效'
    case 1:
      return '已取回'
    case 50:
      return '已取回'
    case 40:
      return '取回中'
    case 30:
      return '取回中'
    default:
      break
    }
  }


  const handleToSteam = async (item) => {
    let url = `https://steamcommunity.com/tradeoffer/${item.trade_offer_id}`
    const w = window.open('about:blank');
    w.location.href = url
  }
  const handleSerive = () => {
    setShowService(true)
  }
  const handleAccept = async (item) => {
    setWithdrawPageData('load', true)
    const res =  await withdraw(item._id);
    setWithdrawPageData('load', false)
    if (res && res.code === 0) {
      refreshWalletInfo()
      let params = {}
      if (sliderType === 'backpack') {
        params = {
          page: page,
          limit: limit,
          queryGroups: JSON.stringify([['status', 'in', [10, 20, 30, 40]]])
        }
      } else if (sliderType === 'history') {
        params = {
          page: page,
          limit: limit,
          queryGroups: JSON.stringify([['status', 'in', [0, 1]]])
        }
      }
      getWithdrawOrders(params)

    } else {
      dealErrCode.dealBoxErrCode()
    }
  }

  const StatusContent = ({item}) => {
    // console.log('item', toJS(item));
    if (item.status === 40 && item.trade_offer_id) {
      return (
        <div className='offer-btn'>
          <div className='retrieve-item-style'>
            <img src={img.icon_gou}/>
            <p>已发送报价</p>
          </div>
          <div className='click-receive' onClick={() => {handleToSteam(item)}}>{'点击收货'}</div>
        </div>
      )
    } else if (item.status === 1 || item.status === 30  || item.status === 50 || item.status === 40) {
      return (
        <p className={item.status === 1 ? 'retrieve-item-types' : 'retrieve-item-typef'}>{statusStr(item.status)}</p>
      )
    }  else if (item.status === 0) {
      return (
        <p className='retrieve-item-types'>{`${statusStr(item.status)}${item.extends.deny_reason ? (item.extends.deny_reason) : ''} `}</p>
      )
    } else {
      return (
        <p className={'retrieve-item-typef'}>暂无库存</p>
      )
    }
  }


  const WithDrawList = () => (
    <Spin spinning={load}>
      <div className='retrieve-list-layout'>
        {withdrawOrdersData.list.map((item, i) => (
          <div key={i} className={'retrieve-list-item'}>
            <div  className={`retrieve-item-bg ${item.$rarityBgClass}`}>
              <img src={item.item_detail.icon_url}/>
            </div>
            <div className='retrieve-item-names'>
              <p className='retrieve-item-fname'>
                {item.$firstTypename}<span className='retrieve-item-twoname'>{`|  ${item.$twoname}`}</span>
              </p>
              <p className='retrieve-item-threename'>{item.$threename}</p>
            </div>
            {sliderType === 'backpack'
              ? <div className='retrieve-item-time'>
                <p>时间:</p>
                <p>{moment(item.created_at).format('HH:mm')}</p>
              </div>
              : <div className='retrieve-item-time'>
                <p>取回时间:</p>
                <p>{moment(item.updated_at).format('HH:mm')}</p>
              </div>
            }
            {sliderType === 'backpack'
              ? <div className='retrieve-item-state'> <StatusContent item={item} /> </div>
              : <div className='retrieve-item-state'>
                <p className='retrieve-item-typetitle'>状态</p>
                <p className={item.status === 1 ? 'retrieve-item-types' : 'retrieve-item-typef'}>{statusStr(item.status)}</p>
              </div>}
          </div>
        ))}
      </div>
    </Spin>

  )


  const Content = () => (
    <Layout.Content>
      {withdrawOrdersData.total > 0 ? <WithDrawList /> : < EmptyData />}
    </Layout.Content>
  )

  const Footer = () => (
    <div className='retrieve-footer'>
      <Pagination size='small'
        defaultCurrent={page + 1}
        showSizeChanger={false}
        total={total}
        current={page + 1}
        onChange={(page) => pageChange(page)} />
    </div>
  )

  return (
    <div className='retrieve-layout'>
      <Layout >
        <Header />
        <Content />
        <Footer />
      </Layout>
    </div>
  );
}
Retrieve.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore', 'centerStore')(observer(Retrieve));

