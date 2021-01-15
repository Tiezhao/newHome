import React, { useState, useEffect } from 'react'
import img from '@utils/img'
import TweenOne from 'rc-tween-one'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Spin } from 'antd';
import { observer, inject } from 'mobx-react'
import YbButton from '@components/YbButton'
import methods from '@utils/methods'
import Avatar from '@components/Avatar'
import YbMoney from '@components/YbMoney'
import history from '@router/history';
import WaitIcon from './components/WaitIcon'
import ActiveIcon from './components/ActiveIcon'

import './index.less'
import { toJS } from 'mobx'

const TweenOneGroup = TweenOne.TweenOneGroup;

const DouBox = ({ appStore }) => {
  const { isAuth, modalStore } = appStore
  const {
    roomList,
    roomListLoading,
    getAsyncRoomList,
    douRank,
    roomRankLoading,
    getAsyncDouRank,
    goRoom,
    queryJionRoom,
    isLastPage,
    getHistoryList,
    historyList,
    isHisLastPage,
    historyLoading
  } = appStore.douStore
  const [tabType, changeTabType] = useState(0)

  useEffect(() => {
    getAsyncRoomList()
    getAsyncDouRank()
  }, [])

  useEffect(() => {
    if (tabType === 1) {
      getHistoryList(10)
    } else if (tabType === 2) {
      getHistoryList(10, 'self')
    }
  }, [tabType])

  const onCreateRoom = () => {
    if (isAuth) {
      history.push('/home/createdou')
    } else {
      modalStore.setShowAuth(true)
    }
  }

  const queryPlay = () => {
    if (isAuth) {
      queryJionRoom()
    } else {
      modalStore.setShowAuth(true)
    }
  }

  const flagWin = (id, val) => {
    let res
    if (val.winner_ids) {
      res = val.winner_ids.find((ele) => ele.user_id === id)
    }
    return !!res
  }

  const _renderRoom = (e) => {
    const classes = classnames('room', {
      'room-active': [30, 35].includes(e.status),
      'end': e.status === 40
    })
    return (
      <li key={e._id} className={classes}>
        <div className="room-top">
          <div className="top-text">
            {[30, 35].includes(e.status) && '正在斗箱'}
            {[1].includes(e.status) && '正在等待'}
            {[40].includes(e.status) && '已结束'}
          </div>
          {[1, 40].includes(e.status) && <WaitIcon paused={e.status === 40} />}
          {[30, 35].includes(e.status) && <ActiveIcon />}
        </div>
        <div className="room-content">
          <div className="money">
            <YbMoney size='big'>{e.amount || 0}</YbMoney>
          </div>
          <TweenOneGroup
            className="man-box"
            leave={{ x: 30, opacity: 0 }}
          >
            {e.user_ids.map((val, i) => {
              if (val) {
                return (
                  <div className={flagWin(val, e) ? 'head-wrap win' : 'head-wrap'} key={val}>
                    <Avatar _id={val} avatarStyle={'man-wrap'} />
                  </div>
                )
              } else {
                return (
                  <div key={i} className="man-wrap">
                    <img src={[30, 35].includes(e.status) ? img.icon_hsrt : img.icon_tjwj} className="add-icon" />
                  </div>
                )
              }
            })}
          </TweenOneGroup>
          {[1, 40].includes(e.status) && <YbButton onClick={() => goRoom(e._id)} type='blue'>{e.status === 1 ? '打开' : '查看'}</YbButton>}
          {[30, 35].includes(e.status) && <YbButton onClick={() => goRoom(e._id)} type='pink'>观战</YbButton>}
        </div>
      </li>
    )
  }

  return (
    <div className='fight-container'>
      <div className='fight-top'>
        <div className="big-title">斗箱大厅</div>
        <div className="big-desc">最多达4人的多人混战大厅，斗开箱，赢者通吃</div>
      </div>
      <div className='fight-content'>
        <div className="tab">
          <div onClick={() => changeTabType(0)} className={tabType === 0 ? 'tab-item tab-active' : 'tab-item'}>
            全部大厅
          </div>
          <div onClick={() => changeTabType(1)} className={tabType === 1 ? 'tab-item tab-active' : 'tab-item'}>
            历史记录
          </div>
          <div onClick={() => changeTabType(2)} className={tabType === 2 ? 'tab-item tab-active' : 'tab-item'}>
            我的记录
          </div>
          <div className="diff">
            <p className='play-text'>如何游玩？</p>
          </div>
        </div>
        <div className={tabType === 0 ? 'room-main show' : 'room-main'}>
          <Spin spinning={roomListLoading}>
            <TweenOneGroup
              className="room-ul"
              leave={{ x: 30, opacity: 0 }}
            >
              {roomList.map((e) => _renderRoom(e))}
            </TweenOneGroup>
            <div className='fight-footer'>
              {!isLastPage && <YbButton onClick={() => getAsyncRoomList()} className='f-btn'>展示更多</YbButton>}
              <p>当前{roomList.length}个斗箱房间</p>
            </div>
          </Spin>
          <div className='fight-rank'>
            <Spin spinning={roomRankLoading}>
              <div onClick={onCreateRoom} className="creat-btn btn">
                创建游戏
              </div>
              <div onClick={queryPlay} className="jion-btn btn">
                快速加入
              </div>
              <div className="super">
                <p className="name">今日之星</p>
                <div className="super-info">
                  {douRank.length > 0 && <Avatar  _id={douRank.length > 0 && douRank[0]._id} avatarStyle={'user-header'}  />}
                </div>
                <div className="money">
                  <YbMoney>{douRank.length > 0 && douRank[0].amount}</YbMoney>
                </div>
              </div>
              <div className="rank-box">
                <p className="rank-title">排行榜</p>
                <ul className='rank-ul'>
                  {douRank.map((rankEle) => (
                    <li key={rankEle._id} className="rank-item">
                      <div className="rank-left">
                        <div key={rankEle._id}>
                          <Avatar  _id={rankEle._id} avatarStyle={'circle-style'}  />
                        </div>
                        <p className="user-name text-hidden">{rankEle.nickname}</p>
                      </div>
                      <div className="rank-right">
                        <YbMoney>{rankEle.amount}</YbMoney>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Spin>
          </div>
        </div>
        <div className={tabType === 1 ? 'history-main show' : 'history-main'}>
          <Spin spinning={historyLoading}>
            <ul className="history-ul">
              {historyList.map((e) => (
                <li key={e._id} className="history-item">
                  <div className="one-row">
                    <div className="top">时间</div>
                    <div className="bottom">{methods.formatDate('YYYY-mm-dd HH:MM:SS', e.created_at)}</div>
                  </div>
                  <div className="one-row">
                    <div className="top">编号</div>
                    <div className="bottom">
                      {e._id}
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">玩家</div>
                    <div className="bottom">
                      <div className="player-imgs">
                        {e.user_ids.map((val) => (
                          <div className={flagWin(val, e) ? 'head-wrap win' : 'head-wrap'} key={val}>
                            <Avatar _id={val} avatarStyle={'one-imgs'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">盲盒信息</div>
                    <div className="bottom">
                      <div className="boxs-info">
                        {e.covers.map((imgVal, index) => (
                          <img key={index} src={imgVal} alt=""/>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">总额</div>
                    <div className="bottom">
                      <YbMoney size='big'>{e.amount}</YbMoney>
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">状态</div>
                    <div className="bottom">已结束</div>
                  </div>
                </li>
              ))}
            </ul>
            {!isHisLastPage && <YbButton onClick={() => getHistoryList(100)} className='f-btn'>展示更多</YbButton>}
          </Spin>
        </div>
        <div className={tabType === 2 ? 'history-main show' : 'history-main'}>
          <Spin spinning={historyLoading}>
            <ul className="history-ul">
              {historyList.map((e) => (
                <li key={e._id} className="history-item">
                  <div className="one-row">
                    <div className="top">时间</div>
                    <div className="bottom">{methods.formatDate('YYYY-mm-dd HH:MM:SS', e.created_at)}</div>
                  </div>
                  <div className="one-row">
                    <div className="top">编号</div>
                    <div className="bottom">
                      {e._id}
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">玩家</div>
                    <div className="bottom">
                      <div className="player-imgs">
                        {e.user_ids.map((val) => (
                          <div className={flagWin(val, e) ? 'head-wrap win' : 'head-wrap'} key={val}>
                            <Avatar _id={val} avatarStyle={'one-imgs'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">盲盒信息</div>
                    <div className="bottom">
                      <div className="boxs-info">
                        {e.covers.map((imgVal, index) => (
                          <img key={index} src={imgVal} alt=""/>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">总额</div>
                    <div className="bottom">
                      <YbMoney size='big'>{e.amount}</YbMoney>
                    </div>
                  </div>
                  <div className="one-row">
                    <div className="top">状态</div>
                    <div className="bottom">已结束</div>
                  </div>
                </li>
              ))}
            </ul>
            {!isHisLastPage && <YbButton onClick={() => getHistoryList(100)} className='f-btn'>展示更多</YbButton>}
          </Spin>
        </div>
      </div>
    </div>
  )
}

DouBox.propTypes = {
  appStore: PropTypes.any
};

export default inject('appStore')(observer(DouBox))
