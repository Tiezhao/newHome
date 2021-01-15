import React from 'react'
import TweenOne from 'rc-tween-one'
import img from '@utils/img'
import { ArrowLeftOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard';
import ReactAudioPlayer from 'react-audio-player';
import { observer, inject } from 'mobx-react'
import AppStore from '@stores/appStore'
import { message, Spin, Modal } from 'antd'
import PropTypes from 'prop-types'
import Avatar from '@components/Avatar'
import YbMoney from '@components/YbMoney'
import history from '@router/history'
import PlayGameBox from './components/PlayGameBox'
import YbButton from '@components/YbButton'
import methods from '@utils/methods'
import opendou from '@assets/audio/opendou.mp3'
import { toJS } from 'mobx';
import WaitIcon from '../DouBox/components/WaitIcon'

const TweenOneGroup = TweenOne.TweenOneGroup;

import './index.less'
class DouOpen extends React.Component {

  async componentDidMount () {
    const { match, cacheLifecycles, appStore } = this.props
    const { douStore } = appStore
    cacheLifecycles.didCache(this.componentDidCache)
    cacheLifecycles.didRecover(this.componentDidRecover)
    if (match.params.id) {
      douStore.getRoomDetail(match.params.id)
    }
  }

  componentDidCache () {
    const { douStore } = AppStore
    douStore.toggleShowModel(false)
  }

  componentDidRecover = async () => {
    const { match, appStore } = this.props
    const { douStore } = appStore
    if (match.params.id) {
      douStore.getRoomDetail(match.params.id)
    }
  }

  onCopyPath = () => {
    if (copy(location.href)) {
      message.success('复制成功')
    } else {
      message.error('复制失败')
    }
  }

  gunBgList = (gunRes) => {
    const { appStore } = this.props
    const { douStore } = appStore

    const { boxsDetail, step } = douStore.roomDetail
    const box = boxsDetail[step - 1]
    if (!box) {return []}
    let list = Object.values(box.box_items)
    if (list.length < 20) {
      const count = 20 - list.length
      for (let i = 0; i < count; i++) {
        list.push(list[methods.randomNum(0, list.length - 1)])
      }
    }
    list[18] = gunRes || {}
    return list
  }

  onCreateRoom = () => {
    const { appStore } = this.props
    const {modalStore} = appStore
    if (appStore.isAuth) {
      history.push('/home/createdou')
    } else {
      modalStore.setShowAuth(true)
    }
  }

  toggleShowModel (val) {
    this.setState({
      showModel: val
    })
  }

  _renderOpenModel () {
    const { appStore } = this.props
    const { douStore } = appStore
    const winItem = douStore.roomDetail.userDetail && douStore.roomDetail.userDetail.find((e) => e.win)
    return (
      <Modal
        title="游戏结束！"
        className='open-model'
        visible={douStore.showModel}
        onCancel={() => douStore.toggleShowModel(false)}
        footer={null}
      >
        <div className="open-model-content">
          <div className="row1">
            恭喜
            <div className='names-box'>
              {douStore.roomDetail.userDetail && douStore.roomDetail.userDetail.map((nVal, index) => {
                if (nVal.win) {
                  return (
                    <span key={index}>{nVal.nickname}</span>
                  )
                }
              })}
            </div>
            赢得
            <YbMoney className='money-box' type='blue'>
              {winItem && winItem.pool_amount}
            </YbMoney>
            的奖励
          </div>
          <div className="row2">
            {douStore.roomDetail.userDetail && douStore.roomDetail.userDetail.map((oVal, index) => {
              if (oVal.win) {
                return (
                  <div key={index} className="row2-item active">
                    <Avatar _id={oVal.user_id} avatarStyle={'header-box'} />
                    <p className='text'>{oVal.nickname}</p>
                  </div>
                )
              } else {
                return (
                  <div key={index} className="row2-item">
                    <Avatar _id={oVal.user_id} avatarStyle={'header-box'} />
                  </div>
                )
              }
            })}
          </div>
          <div className="row3">
            <div onClick={this.onCreateRoom.bind(this)} className="btn1">创建你自己的竞技场</div>
            <div onClick={() => history.push('/home/doubox')} className="btn2">玩更多</div>
          </div>
        </div>
      </Modal>
    )
  }

  openResBox (val) {
    const { appStore } = this.props
    const { douStore } = appStore
    let winCount = 0
    for (const item of douStore.roomDetail.userDetail) {
      if (item.win) {
        winCount++
      }
    }
    if (winCount === douStore.roomDetail.mode) {
      return (
        <div className="win">
          <div className="win-item">
            <p className="win-text">平局！</p>
            <YbMoney type='blue'>{val.pool_amount}</YbMoney>
          </div>
        </div>
      )
    } else if (winCount === 1 && val.win) {
      return (
        <div className="win">
          <div className="win-item">
            <p className="win-text">胜利！</p>
            <YbMoney type='blue'>{val.pool_amount}</YbMoney>
          </div>
          <div className="win-item">
            <p className="win-text">全面胜利</p>
            <YbMoney type='blue'>{val.pool_amount}</YbMoney>
          </div>
        </div>
      )
    } else if (winCount > 1 && winCount < douStore.roomDetail.mode && val.win) {
      return (
        <div className="win">
          <div className="win-item">
            <p className="win-text">胜利！</p>
            <YbMoney type='blue'>{val.pool_amount}</YbMoney>
          </div>
        </div>
      )
    } else {
      return (
        <div className="lost-item">
          <YbMoney type='pink'>{val.pool_amount}</YbMoney>
        </div>
      )
    }
  }

  _renderCommonItem = (val, index) => {
    const { appStore, match } = this.props
    const { douStore } = appStore
    const { roomDetail, amountList } = douStore
    let amount = 0
    let jiCount = roomDetail.amount
    if (roomDetail.status > 1) {
      amount = amountList.length > 0 && amountList[index]
      jiCount = roomDetail.amount
      if (!val.win && roomDetail.status === 40) {
        // amount = 1
        // jiCount = 10
      } else if (val.win && roomDetail.status === 40) {
        amount = val.winItem.reduce(function (prev, cur) {
          return prev + cur.exchange_price;
        }, 0);
      }
    }

    return (
      <div key={val.user_id || 0 + index} className="show-item">
        <div className="item-top">
          {val.user_id && !roomDetail.step && (
            <div className="svg-wrap">
              <svg
                t="1593668039662"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="8096"
                width="100"
                height="100"
              >
                <path
                  className="move-svg"
                  // eslint-disable-next-line max-len
                  d="M510.711826 0.000661c88.526352 0 173.914642 22.16462 249.88875 63.834766a24.774166 24.774166 0 1 1-23.832747 43.437371A468.446439 468.446439 0 0 0 510.711826 49.548992a468.479471 468.479471 0 0 0-222.736265 55.940066 24.774166 24.774166 0 1 1-23.485909-43.635564A518.011286 518.011286 0 0 1 510.711826 0.000661zM512.000083 1023.999505c-88.526352 0-173.914642-22.16462-249.888751-63.834767a24.774166 24.774166 0 1 1 23.849264-43.43737A468.446439 468.446439 0 0 0 512.000083 974.451173c78.864427 0 154.871567-19.389914 222.75278-55.940066a24.774166 24.774166 0 1 1 23.485909 43.635564A518.011286 518.011286 0 0 1 512.000083 1023.999505zM1023.999505 512.000083c0 88.542868-22.16462 173.914642-63.834767 249.88875a24.774166 24.774166 0 1 1-43.43737-23.832748A468.446439 468.446439 0 0 0 974.451173 512.016599c0-78.864427-19.389914-154.871567-55.940066-222.752781a24.774166 24.774166 0 1 1 43.635564-23.485909A518.011286 518.011286 0 0 1 1023.999505 512.000083zM0.000661 513.734274c0-88.526352 22.16462-173.914642 63.834766-249.88875a24.774166 24.774166 0 0 1 43.437371 23.849263A468.446439 468.446439 0 0 0 49.548992 513.734274c0 78.864427 19.389914 154.871567 55.940066 222.752781a24.774166 24.774166 0 1 1-43.635564 23.485909A518.011286 518.011286 0 0 1 0.000661 513.734274z"
                  fill="#02BF4D"
                  p-id="8097"
                ></path>
                <path
                  d="M512.000083 0.000661c282.75581 0 511.999422 229.243612 511.999422 511.999422 0 282.75581-229.243612 511.999422-511.999422 511.999422C229.244273 1023.999505 0.000661 794.755892 0.000661 512.000083 0.000661 229.244273 229.244273 0.000661 512.000083 0.000661z m0 49.548331C256.594952 49.548992 49.548992 256.594952 49.548992 512.000083s207.04596 462.451091 462.451091 462.45109 462.451091-207.04596 462.45109-462.45109S767.405214 49.548992 512.000083 49.548992z"
                  fill="#02BF4D"
                  opacity=".2"
                  p-id="8098"
                ></path>
                <path
                  d="M752.210392 407.882523L469.570195 698.318324c-7.267089 7.481798-13.906565 11.875083-28.457258 11.875083-14.567209 0-21.124105-4.343737-28.473774-11.875083l-140.965003-144.87932c-13.906565-14.286435-13.906565-36.038153 0-51.018265 13.906565-14.963596 35.080218-14.286435 49.647428 0l119.807865 116.306449 254.166423-261.169254c13.906565-14.286435 35.080218-14.286435 49.647427 0 14.567209 14.286435 13.906565 36.038153 7.267089 50.324589z"
                  fill="#02BF4D"
                  p-id="8099"
                ></path>
              </svg>
            </div>
          )}
          {!val.user_id && (
            <YbButton loading={douStore.jionLoading} onClick={() => douStore.joinAsyncRoom(match.params.id)} type='pink' active color='#fff'>
              {appStore.isAuth ? '加入' : '登录以加入'}
            </YbButton>
          )}
          {roomDetail.status === 40 && this.openResBox(val)}
          {roomDetail.status === 35 &&
           roomDetail.step > 0 &&
           <PlayGameBox
             step={roomDetail.step}
             gunBgList={this.gunBgList(val.winItem[roomDetail.step - 1])}
           />
          }
        </div>
        {val.user_id && (
          <div className="item-bottom">
            <p className="user-name">{val.nickname}</p>
            <div className="user-info">
              <Avatar _id={val.user_id} avatarStyle={'nav-style'}  />
              <YbMoney>{amount}</YbMoney>
            </div>
            <div className="progress-wrap">
              <div
                style={{
                  width: `${amount ? (amount / jiCount) * 100 : 0}%`
                }}
                className="progress"
              />
            </div>
          </div>
        )}
        {douStore.roomDetail.status !== 1 && (
          <TweenOneGroup
            className="gun-list"
            enter={{ x: -30, opacity: 0, type: 'from', width: 0, delay: douStore.roomDetail.status === 35 ? 2000 : 0 }}
            leave={{ x: -30, opacity: 0 }}
          >
            {val.winItem.length > 0 && val.winItem.slice(0, douStore.roomDetail.status === 40 ? undefined : douStore.roomDetail.step).reverse()
              .map((e, i) => {
                if (!e) {return null}
                return (
                  <div key={e.selfKey} className='gun-item'>
                    <div className={`gun-inner ${e.$rarityBgClass}`}>
                      <img
                        className='gun-img'
                        style={{margin: douStore.roomDetail.mode === 4 ? '16% auto 0px' : '20% auto 10px'}}
                        src={e.detail.icon_url}
                        alt=""
                      />
                      <p className={douStore.roomDetail.mode === 4 ? 'gun-name text-hidden' : 'gun-name'}>{e.$firstTypename} | <span>{e.$twoname}</span></p>
                      <div className="gold-box">
                        <YbMoney size='small'>{e.exchange_price}</YbMoney>
                      </div>
                      <p className="icon-text">{e.$exterior.name}</p>
                    </div>
                  </div>
                )
              })}
          </TweenOneGroup>
        )}
      </div>
    )
  }

  render () {
    const { appStore } = this.props
    const { douStore } = appStore

    return (
      <div className='open-fight-container'>
        <ReactAudioPlayer
          autoPlay={false}
          ref={(element) => douStore.setAudio(element)}
          src={opendou}
        />
        {this._renderOpenModel()}
        <div className='fight-top'>
          <div className="big-title">
            {douStore.roomDetail.status === 40 && '对局已完成'}
            {douStore.roomDetail.status === 1 && '斗箱等待中'}
            {douStore.roomDetail.status > 1 && douStore.roomDetail.status < 40 && '斗箱进行中'}
          </div>
          <div className="big-desc">最多达4人的多人混战大厅，斗开箱，赢者通吃</div>
        </div>
        <div className='fight-content'>
          <div className="tab">
            <div onClick={() => history.push('/home/doubox')} className='tab-item'>
              <ArrowLeftOutlined
                className='back-icon'
              />
              <p className="back-text">返回列表</p>
            </div>
            <div className="right-box">
              <div onClick={this.onCopyPath.bind(this)} className="copy-btn">复制链接</div>
              <input readOnly className='url-input' value={location.href} type="text"/>
            </div>
          </div>
          <Spin spinning={douStore.detailLoading}>
            <div className="open-main">
              <div className="open-round">
                <div className="round-left">
                  <span className="all-money">总共价格</span>
                  <YbMoney size='big'>{douStore.roomDetail.amount}</YbMoney>
                </div>
                <div className="round-center">
                  第{douStore.roomDetail.step || 0}回合
                </div>
                <div className="round-right">
                  {douStore.roomDetail.status > 1 && douStore.roomDetail.status !== 40 && (
                    <div className="going">
                      <p className="text">进行中</p>
                      <div className="going-icon" />
                    </div>
                  )}
                  {douStore.roomDetail.status === 1 && (
                    <div className="await">
                      <div className="top-text">
                        正在等待
                      </div>
                      <WaitIcon />
                    </div>
                  )}
                  {douStore.roomDetail.status === 40 && (
                    <div className="finish">
                      <p className="text">完成</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="open-step">
                <TweenOne
                  animation={{
                    x: -94 * (douStore.roomDetail.step - 1) - 30,
                    ease: 'easeOutQuart',
                    duration: 300
                  }}
                >
                  <ul className="step-wrap">
                    {douStore.roomDetail.boxsDetail && douStore.roomDetail.boxsDetail.map((e, i) => (
                      <li
                        key={e._id + String(i)}
                        className={(i + 1) === douStore.roomDetail.step ? 'step-item step-acitve' : 'step-item'}
                      >
                        <div className="step-num">{i + 1}</div>
                        <div style={{backgroundImage: `url('${e.cover}')`}} className="step-img-box">
                          <img
                            className='step-box'
                            src={Object.values(e.box_items)[0].detail.icon_url}
                            alt=""
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </TweenOne>
              </div>
              <div className="open-show">
                {douStore.roomDetail.status === 35 &&
                 douStore.roomDetail.step > 0 && (
                  <div className="game-line">
                    <img className='left-icon' src={img.icon_kxzzs} alt=""/>
                    <div className="line" />
                    <img className='right-icon' src={img.icon_kxzzs} alt=""/>
                  </div>
                )}
                {douStore.roomDetail.userDetail && douStore.roomDetail.userDetail.map((e, i) => this._renderCommonItem(e, i))}
              </div>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}


DouOpen.propTypes = {
  match: PropTypes.any,
  appStore: PropTypes.any,
  cacheLifecycles: PropTypes.any
};

export default inject('appStore')(observer(DouOpen))

