import React, { useState, useEffect, useRef} from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'
import {  Button, Col, Layout, Menu,  Row, Spin } from 'antd';
import PropTypes from 'prop-types'
import config from '@configs/config'
import { useHistory } from 'react-router-dom';
import { toJS } from 'mobx';
import img from '@utils/img'
import moment from 'moment';
import dealErrCode from '@utils/dealErrCode'
import EmptyData from '@components/EmptyData';
import ServiceModal from '@components/ServiceModal'

function Retrieve ({ appStore, centerStore}) {
  let history = useHistory()
  const { isAuth, setAuth, boxStore, refreshWalletInfo, modalStore} = appStore
  const {showRetrieve, setShowRetrieve, showService, setShowService } = modalStore

  const {setCenterType, centerType} = centerStore

  const {
    getWithdrawOrders,
    withdrawPageData,
    setWithdrawPageData,
    withdrawOrdersData,
    withdraw,
    stramUserInfo,
    getSteamUserInfo,
  } = boxStore

  const { page, limit, load, total} = withdrawPageData

  useEffect(() => {
    getSteamUserInfo()
    getWithdrawOrders()
  }, [])
  const sliderList = [
    { title: '取回中', key: 'backpack'},
    { title: '历史取回', key: 'history'},
  ];

  const  [sliderType, setSliderType] =  useState('backpack');
  const scrollRef = useRef()
  const [listno, setListno] = useState(true)
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
        queryGroups: JSON.stringify([['status', 'in', [0, 1]]])
      }
    }
    getWithdrawOrders(params)
  }
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


  const onScrollEvent = () => {
    // console.log('scrollRef', scrollRef.current);
    if (scrollRef.current.scrollTop + scrollRef.current.clientHeight ===
      scrollRef.current.scrollHeight) {
      if (withdrawOrdersData.total <= withdrawOrdersData.list.length) {
        console.log('没有更多数据');
        setListno(true)
      } else {
        setWithdrawPageData('page', page + 1);
        let parmas = {}
        if (sliderType === 'backpack') {
          parmas = {
            page: page,
            limit: limit,
            queryGroups: JSON.stringify([['status', 'in', [10, 20, 30, 40]]])
          }

        } else if (sliderType === 'history') {

          parmas = {
            page: page,
            limit: limit,
            queryGroups: JSON.stringify([['status', 'in', [0, 1]]])
          }
        }
        getWithdrawOrders(parmas)
      }

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
      </Row>
    </Layout.Header>
  )
  const Footer = () => (
    <Layout.Footer onClick={handleSerive}>
      <div className='retrieve-slider-footer' >
        <img src={img.icon_kftb}/>
        <p>取回遇到问题，请联系客服</p>
      </div>
    </Layout.Footer>

  )

  const Change = () => (
    <div className='retrieve-slider-header'>
      <p className='title-text'>取回助手</p>
      <img src={img.icon_qhzsgb} onClick={() => {
        setShowRetrieve(false);
      }} />
    </div>
  )


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
    <Spin
      spinning={load}
    >
      {total > 0
        ? <div
          ref={scrollRef}
          onScrollCapture={() => onScrollEvent()}
          className='retrieve-list-layout'
        >
          {withdrawOrdersData.list.map((item, i) => (
            <div key={i} className={'retrieve-list-item'}>
              <div className='retrieve-item-info'>
                <div  className={`retrieve-item-bg ${item.$rarityBgClass}`}>
                  <img src={item.item_detail.icon_url}/>
                </div>
                <div className='retrieve-info'>
                  <div className='retrieve-item-fname'>
                    <p>
                      <span> {item.$firstname}</span>
                      <span className='retrieve-item-twoname'>{`|  ${item.$twoname}`}</span>
                    </p>
                    <p className='retrieve-item-twoname'>{sliderType === 'history' ?  moment(item.updated_at).format('HH:mm') : moment(item.created_at).format('HH:mm')}</p>
                  </div>
                  <div className='retrieve-item-status'>
                    <StatusContent item={item} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {listno ? <p style={{textAlign: 'center'}}>没有更多数据</p> : null}
        </div>
        : <EmptyData/>}
    </Spin>

  )

  const Content = () => (
    <Layout.Content>
      <WithDrawList  />
    </Layout.Content>
  )

  const BindSteam = () => (
    <div className='backpack-steammodal-layout'>
      <div className='backpack-steammodal-logo'>
        <img src={img.icon_dlsteam} />
        <p>STEAM</p>
      </div>
      <p>您还未绑定steam交易链接，请绑定</p>
      <div className='backpack-steam-btn' onClick={() => {
        history.push('/home/center/profile')
        setCenterType('profile')
        setShowRetrieve(false)
      }} >
        <p>立刻绑定</p>
      </div>
    </div>
  )


  return (
    <div className='retrieve-slider-layout'>
      <Change />
      {stramUserInfo.steam.trans_link
        ? <Layout >
          <Header />
          <Content />
          <Footer />

        </Layout>
        : <BindSteam />
      }

    </div>
  );
}
Retrieve.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore', 'centerStore')(observer(Retrieve));
