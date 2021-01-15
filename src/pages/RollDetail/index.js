import './index.less'
import img from '@utils/img'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import { Pagination, Spin, message, Modal} from 'antd';
import React, { useState, useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { toJS } from 'mobx';
import RollModal from './components/RollModal'
import Avatar from '@components/Avatar'
import moment from 'moment';
import methods from '@utils/methods'
import dealErrCode from '@utils/dealErrCode'
function RollDetail ({ appStore, match}) {
  const {activityStore} = appStore
  const {getRollDetail, RollDetailData, RollItems, rollLoad, getActivityUserInfo, AllUserData, setShowRoll, getActivityWinnerInfo, WinUserData, allUserPage, winUserPage, setAllData, setWinData, myImg, getActivityUserJoin, activity_id} = activityStore
  const {allPage, allLimit, allTotal} = allUserPage
  const {winPage, winLimit, winTotal} = winUserPage
  let history = useHistory()
  useEffect(() => {
    getRollDetail(match.params._id)
    let params = {
      page: 0,
      limit: 18,
      queryGroup: JSON.stringify([['activity_queue_id', 'eq', match.params._id]])
    }
    getActivityUserInfo(params)
    let winparams = {
      page: 0,
      limit: 18,
      queryGroup: JSON.stringify([['activity_queue_id', 'eq', match.params._id], ['activity_detail.is_win', 'eq', true]])
    }
    getActivityWinnerInfo(winparams)
  }, [match.params._id])
  console.log('RollDetailData', toJS(RollDetailData))
  const allPageChange = (val) => {
    setAllData('allPage', val - 1)
    let params = {
      page: val - 1,
      limit: allLimit,
      queryGroup: JSON.stringify([['activity_queue_id', 'eq', match.params._id]])
    }
    getActivityUserInfo(params)
  }
  const winPageChange = (val) => {
    setWinData('winPage', val - 1)
    let params = {
      page: val - 1,
      limit: winLimit,
      queryGroup: JSON.stringify([['activity_queue_id', 'eq', match.params._id], ['activity_detail.is_win', 'eq', true]])
    }
    getActivityWinnerInfo(params)
  }
  const handleCode = async () => {
    if (RollDetailData.options.roll_type === 2) {
      setShowRoll(true)
    } else {
      const obj = {
        activity_id: activity_id,
      }
      const res = await getActivityUserJoin(obj)
      console.log(res.code)
      if (res.code === 0) {
        message.success('已加入成功')
        let params = {
          page: 0,
          limit: 18,
          queryGroup: JSON.stringify([['activity_queue_id', 'eq', match.params._id]])
        }
        getActivityUserInfo(params)
      } else  {
        dealErrCode.dealRollErrCode(res.code)
      }

    }
  }
  const GoBack = () => (
    <div onClick={() => history.push('/home/roll')} className='tab-item'>
      <ArrowLeftOutlined
        className='back-icon'
      />
      <p className="back-text">返回ROLL房首页</p>
    </div>
  )
  const Title = () => (
    <div className='roll-detail-header' style={{
      backgroundImage: `url(${RollDetailData.poster})`
    }}>
      <div className='status-title'>
        {RollDetailData.status == 1 ? <div>进行中</div> : <div>已结束</div>}
      </div>
      <div className='roll-detail-left'>
        <div className={`roll-weapon-bg ${RollDetailData.$myrarityBgClass}`} >
          <img src={myImg}/>
        </div>
        <div className='roll-room-dec'>
          <p>房间号：{RollDetailData.options.roll_no}</p>
          <p>参与人数：{RollDetailData.options.user_total}</p>
          <p>开奖时间：{moment(RollDetailData.options.stop_time).format('YYYY-MM-DD HH:mm')}</p>
          <p>说明:{RollDetailData.description}</p>
        </div>
      </div>
      {RollDetailData.status == 1 ? <div className='join-btn' onClick={() => {handleCode()}}>立即加入</div> : <div className='finish-btn'>已结束</div>}


    </div>
  )
  const Header = () => (
    <div className='roll-detail-footer'>
      <div className='roll-foot-title'>中奖用户</div>
      <div className='roll-user-ground'>
        {WinUserData.list.map((item, j) => {
          let otherUserInfo = {
            _id: item.user_id,
            avatar: item.activity_detail.avatar,
          }
          return (<div className='roll-user-info' key={j}>
            <div className='roll-user-border'>
              <Avatar avatarStyle={'roll-user-avatar'} otherUserInfo={otherUserInfo} />
            </div>
            <div className='roll-user-name'>{item.activity_detail.nickname}</div>
          </div>
          )
        })}
      </div>

      {winTotal > 0 ? <WinPagination/> : null}
    </div>
  )
  const Body = () => (
    <div className='roll-detail-body'>
      <div className='roll-body-title'>活动奖池</div>
      <div className='roll-ground-box'>
        {RollItems.map((item, i) => (
          <div className={`roll-card-box ${item.$rarityBgClass}`}  key={i}>
            <div className='roll-card-top'>
              <p>{'$ '}{methods.MoneySlice(item.price)}</p>
              <p className='text-color'>{item.$exterior.name}</p>
            </div>
            <img src={item.icon_url} />
            <div className='roll-card-buttom'>{`${item.$firstTypename}  | `}<span>{item.$twoname}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
  const Footer = () => (
    <div className='roll-detail-footer'>
      <div className='roll-foot-title'>参与用户</div>
      {allTotal > 0 ?  <div className='roll-user-ground'>
        {AllUserData.list.map((item, j) => {
          let otherUserInfo = {
            _id: item.user_id,
            avatar: item.activity_detail.avatar,
          }
          return (
            <div className='roll-user-info' key={j}>
              <div className='roll-user-border'>
                <Avatar avatarStyle={'roll-user-avatar'} otherUserInfo={otherUserInfo} />
              </div>
              <div className='roll-user-name'>{item.activity_detail.nickname}</div>
            </div>
          )
        })}
      </div> : <p className='roll-none-data'>暂无用户参与,快速加入将为您好带来好运气！</p>}
      {allTotal > 0 ? < AllPagination/> : null}

    </div>
  )
  const AllPagination = () => (
    <div className='roll-detail-page'>
      <Pagination
        size='small'
        defaultCurrent={allPage + 1}
        showSizeChanger={false}
        total={allTotal}
        current={allPage + 1}
        showLessItems
        onChange={(page) => allPageChange(page)}
      />
    </div>
  )
  const WinPagination = () => (
    <div className='roll-detail-page'>
      <Pagination
        size='small'
        defaultCurrent={winPage + 1}
        showSizeChanger={false}
        total={winTotal}
        current={winPage + 1}
        showLessItems
        onChange={(page) =>  winPageChange(page)}
      />
    </div>
  )
  return (
    <Spin spinning={rollLoad}>
      <div className='roll-detail-layout'>
        <GoBack />
        <Title/>
        {RollDetailData.status == 2 ? <Header/> : null}
        <Body/>
        <Footer/>
        <RollModal/>
      </div>
    </Spin >
  )
}

RollDetail.propTypes = {
  appStore: PropTypes.any,
  match: PropTypes.any,
};
export default inject('appStore')(observer(RollDetail));
