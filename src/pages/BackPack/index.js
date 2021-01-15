import React, { useState, useEffect, useRef, useContext } from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import { toJS } from 'mobx';
import methods from '@utils/methods'
import dealErrCode from '@utils/dealErrCode'
import {  Pagination, Button, Spin, message, Modal, Layout} from 'antd';
import { useForm } from 'react-hook-form';
import Avatar from '@components/Avatar'
import EmptyData from '@components/EmptyData';
import img from '@utils/img';
import _ from 'lodash';

function BackPack ({ appStore, centerStore }) {
  let history = useHistory()
  const { isAuth, walletInfo, userInfo, boxStore, refreshWalletInfo, getUserInfoAndWalletInfo, modalStore} = appStore

  const {setShowLimit} = modalStore
  const {setCenterType, centerType} = centerStore
  const { register, handleSubmit, errors, setValue } = useForm();
  const [showBindSteam, setShowBindSteam] = useState(false)
  const {
    getUserData,
    backPageData,
    userItemData,
    setBackData,
    stramUserInfo,
    exchange,
    withdraw,
    pushExchangePromise,
    setUserItemData} = boxStore
  const { page, limit, total, load, steamload} = backPageData;
  useEffect(() => {
    getUserData()

  }, [centerType])

  const balance = methods.MoneySlice(walletInfo.balance, false)
  let nickName = userInfo.nickname ? userInfo.nickname : ''
  if (nickName.length > 10) {
    nickName = nickName.substring(0, 10)
    nickName = `${nickName}...`
  }
  const pageChange = (val) => {

    setBackData('page', val - 1)
    let params = {
      page: val - 1,
      limit: limit
    }

    getUserData(params)
  }


  const refreshTable = () => {
    setBackData('limit', 12)
    const parmas = {
      page: page,
      limit: limit,
    }
    getUserData(parmas)
  }

  const handleExchange = async (item) => {
    let cloneResultData = _.cloneDeep(userItemData)
    let taskbackItembe = cloneResultData.list.find((e) => e._id  === item._id)
    if (taskbackItembe) {
      taskbackItembe['recycling'] = true
    }
    setUserItemData(cloneResultData)
    const res =  await exchange(item._id);

    if (res && res.code === 0) {
      refreshTable()
      getUserInfoAndWalletInfo()
      message.success('回收成功')
    } else {
      dealErrCode.dealSteamErrCode(res.code)
    }
  }
  // 取回
  const handleWithdraw = async (item) => {
    try {
      let cloneResultData = _.cloneDeep(userItemData)
      let taskbackItembe = cloneResultData.list.find((e) => e._id  === item._id)
      if (taskbackItembe) {
        taskbackItembe['backing'] = true
      }
      setUserItemData(cloneResultData)
      if (!stramUserInfo.steam.trans_link) {
        setShowBindSteam(true)
        return
      }
      const res =  await withdraw(item._id);
      taskbackItembe['backing'] = false
      setUserItemData(cloneResultData)
      if (res) {

        if (res.code === 0) {
          refreshWalletInfo()
          refreshTable()
        } else if (res.code ===  2253) {
          setShowLimit(true)
        } else if (res.code ===  2261)  {
          if (res.data.trade_desc) {
            message.error(res.data.trade_desc)
          }
        } else {
          dealErrCode.dealBoxErrCode(res.code)
        }
      }
    } catch (error) {
      console.log('error', error);
    }


  }


  const handletaskAll = async () => {
    let cloneResultData = _.cloneDeep(userItemData)
    let allUserItemIDs = []
    for (let i = 0; i < cloneResultData.list.length; i++) {
      const resultItem = cloneResultData.list[i];
      resultItem['recycling'] = true
      allUserItemIDs.push(resultItem._id)
      // console.log('resultItem', toJS(resultItem));
    }
    setUserItemData(cloneResultData)
    let promiseList =  pushExchangePromise(allUserItemIDs)
    Promise.all(promiseList).then((result) => {
      if (result) {
        for (let i = 0; i < result.length; i++) {
          const res = result[i];
          if (!res || res.code !== 0) {
            dealErrCode.dealBoxErrCode(res.code)
          }
        }
        const parmas = {
          page: page,
          limit: limit
        }
        getUserData(parmas)
        refreshWalletInfo()
        message.success('回收成功')
      }
    })
  }
  const AuthModal = () => (
    <Modal
      className='backpack-steammodal-box'
      width={420}
      visible={showBindSteam}
      onCancel={() => {setShowBindSteam(false)}}
      centered
      footer={null}
    >
      <Layout>
        <div className='backpack-steammodal-layout'>
          <div className='backpack-steammodal-logo'>
            <img src={img.icon_dlsteam} />
            <p>STEAM</p>
          </div>
          <p>您还未绑定steam交易链接，请绑定</p>
          <div className='backpack-steam-btn' onClick={() => {
            history.push('/home/center/profile')
            setCenterType('profile')
            setShowBindSteam(false)
          }} >
            <p>立刻绑定</p>
          </div>
        </div>
      </Layout>
    </Modal>
  )


  const UserInfo = () => (
    <div className='backpack-info-user'>
      <div className='info-box' >
        <div className='info-img'>
          <Avatar avatarStyle={'backpad-style'} />
        </div>
        <div className='info-item'>
          <p>{nickName}</p>
          <p><span>余额: </span>{String(balance)}</p>
        </div>
      </div>
      <div className='info-charge' onClick={() => {
        setCenterType('charge')
        history.push('/home/center/charge')
      }}>充值</div>
    </div>
  )

  const AllTask = () => (
    <Button onClick={handletaskAll}>本页回收</Button>
  )

  const Body = () => (
    <div >
      {total > 0
        ?           <div className='backpack-content-body'>
          {userItemData.list.map((item, i) => (
            <div className='backpack-card' key={i} >
              <div className={`backpack-card-top ${item.$rarityBgClass}`} >
                <img src={item.item_detail.icon_url}/>
                <p>{`${item.$firstTypename} | `}<span>{item.$twoname}</span></p>
                <div className='backpack-quality'>{item.$exterior.name}</div>
              </div>
              <div className='backpack-card-bottom'>
                <Button loading={item.recycling}  className='sell-btn' onClick={() => {handleExchange(item)}}>
                  {'回收 $ '}<span>{methods.MoneySlice(item.exchange_price, false)}</span>
                </Button>
                <Button loading={item.backing} className='get-btn'onClick={() => {handleWithdraw(item)}} >
                取回
                </Button>
              </div>
            </div>
          ))}
        </div> : <EmptyData/>
      }
    </div>
  )
  const Header = () => (
    <div className='backpack-info-box'>
      <UserInfo />
      {total > 0  ? <AllTask /> : null}
    </div>
  )
  const  Footer = () => (
    <div className='backpack-page'>
      {total > 0
        ? <Pagination
          size='small'
          defaultCurrent={page + 1}
          showSizeChanger={false}
          total={total}
          current={page + 1}
          showLessItems
          onChange={(page) => pageChange(page)}
        /> : null
      }
    </div>
  )
  return (
    <Spin spinning={load}>
      <div className='backpack-layout'>
        <Header />
        <Body  />
        <Footer />
        <AuthModal />
      </div>
    </Spin>
  );
}
BackPack.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore', 'centerStore')(observer(BackPack));
