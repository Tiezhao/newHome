
import { observer, inject } from 'mobx-react'
import React, { Component } from 'react'

import './index.less'
import PropTypes from 'prop-types'
import ReactAudioPlayer from 'react-audio-player';
import { toJS } from 'mobx';
import img from '@utils/img'
import _ from 'lodash';
import methods from '@utils/methods'
import { Spin, message} from 'antd';
import openvoice from '@assets/audio/openBox.mp3'
import resultvoice from '@assets/audio/result.mp3'
import dealErrCode from '@utils/dealErrCode'
import history from '@router/history';
import store from '../store/index'
import sendAction from '../reducer/index'

@inject('appStore') @observer class BoxInfo extends Component {
  constructor (props) {
    super()
    this.state = {
      selectBet: 1,
      lock: false,
      playSeconds: 0,
      betList: [
        { title: 'x1', value: 1 },
        { title: 'x2', value: 2 },
        { title: 'x3', value: 3 },
        { title: 'x4', value: 4 },
        { title: 'x5', value: 5 },
      ]
    }

  }
  componentDidMount () {
    this.handleAudioListen = this.handleAudioListen.bind(this);
    
  }
  componentWillUnmount () {
    console.log('componentWillUnmount');
    const {appStore} = this.props
    const {boxStore, userinfo } = appStore
    if (this.rap && this.rap.audioEl && this.rap.audioEl.current) {
      this.rap.audioEl.current.pause();
    }
    if (this.resultRap && this.resultRap.audioEl && this.resultRap.audioEl.current) {
      this.resultRap.audioEl.current.pause();
    }
    window.clearTimeout(this.callTimeout)
    boxStore.setShowLottery(false)
    boxStore.setBoxType(false)
  }

  // 打开箱子debounce
  handleOpenWeapon =  async () => {

    const {appStore} = this.props
    const {boxStore, modalStore} = appStore

    this.setState({
      lock: true
    })
    if (!appStore.isAuth) {
      modalStore.setShowAuth(true)
      return
    }
    try {
      boxStore.initMachine(boxStore.boxDetailData)
      const res = await boxStore.openBox(this.props._id, this.state.selectBet)
      this.setState({
        lock: false
      })
      if (res.code === 0) {
        boxStore.getUserData()
        let resultData = {
          allPrice: 0,
          resultList: []
        }
        let allPrice = 0
        for (let i = 0; i < res.data.item_ids.length; i++) {
          const resultId = res.data.item_ids[i];
          let boxDetailData = _.cloneDeep(boxStore.boxDetailData.box_items)
          for (let j = 0; j < boxDetailData.length; j++) {
            let boxItems = boxDetailData[j];
            if (boxItems.item_id === resultId) {
              boxItems['user_item_id'] = res.data.user_item_ids[i]
              boxItems['recycling'] = false
              allPrice += boxItems.exchange_price
              resultData.resultList.push(boxItems)
              resultData.allPrice = allPrice
            }
          }
        }
        for (let i = 0; i < resultData.resultList.length; i++) {
          const element = resultData.resultList[i];
          console.log('resultList', element);

        }
        appStore.refreshWalletInfo()
        boxStore.setBoxResultData(resultData)
        boxStore.setBoxType(true)
        this.startMoreAnimation(resultData.resultList)
      } else {
        dealErrCode.dealBoxErrCode(res.code)
        this.setState({
          lock: false
        })
      }
    } catch (error) {
      const {boxStore} = appStore

      console.log('error', error);
      boxStore.setBoxType(false)
      boxStore.setOpenBoxLoad(false)
    }
  }

  setNewAwardGroupList = (winnerList, callBack) => {
    const { appStore } = this.props
    const {boxStore} = appStore
    const newWinnerList = _.cloneDeep(winnerList)
    let newAwardGroupList = _.cloneDeep(boxStore.awardGroupList)
    for (let i = 0; i < newWinnerList.length; i++) {
      const winnerItem = newWinnerList[i];
      for (let j = 0; j < newAwardGroupList.length; j++) {
        const newAwardList = newAwardGroupList[j];

        if (i === j) {
          if (this.state.selectBet === 1 || this.state.selectBet === 2) {
            newAwardList.splice(newAwardList.length - 3, 0, winnerItem);
          } else if (this.state.selectBet === 3 ||
                      this.state.selectBet === 4 ||
                      this.state.selectBet === 5) {
            newAwardList.splice(newAwardList.length - 4, 0, winnerItem);
          }

        }
      }
    }
    console.log('newAwardGroupList-start', newAwardGroupList);
    boxStore.setAwardGroupList(newAwardGroupList)

    callBack && callBack();
  }


  startMoreAnimation = (winnerList) => {
    const { appStore } = this.props
    const {boxStore} = appStore
    this.setNewAwardGroupList(winnerList, () => {
      this.startAnimTimeout(() => {
        console.log('endamimation');
        boxStore.setShowLottery(true)
        this.handleResultAudioPlay()

      })
    })


  }

  randomNum (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  startAnimTimeout = (callBack) => {
    this.handleAudioPlay();
    for (let i = 0; i < this.state.selectBet; i++) {
      let rendomAnimationCount = this.randomNum(0, 5)
      let rendomPosition  = 0
      let offSet = 0
      switch (this.state.selectBet) {
      case 1:
        rendomPosition = this.randomNum(-60, 80)
        offSet = 192
        break;
      case 2:
        rendomPosition = this.randomNum(0, 90)
        offSet = 192
        break;
      case 3:
        rendomPosition = this.randomNum(-20, 50)
        offSet = 138
        break;
      case 4:
        rendomPosition = this.randomNum(-20, 50)
        offSet = 138
        break;
      case 5:
        rendomPosition = this.randomNum(-20, 50)
        offSet = 138
        break;
      default:
        break;
      }

      console.log('rendomPosition', rendomPosition);
      // eslint-disable-next-line react/no-string-refs
      const movRef = this.refs[`moveRef${i}`]
      const parentWidth = movRef.parentNode.clientWidth - rendomPosition + offSet;
      movRef.style.transition =  `8.${rendomAnimationCount}s all cubic-bezier(0,0.38,0.58,1)`;
      movRef.style.transform = `translateX(calc(-100% + ${parentWidth}px))`;
    }


    this.callTimeout = setTimeout(() => {
      callBack && callBack()
    }, 8700);
  }

  handleBetCount = (betinfo) => {

    this.setState({
      selectBet: betinfo.value
    })
  }


  handleAudioPlay () {
    try {
      const curAudio = this.rap.audioEl.current;
      this.playSeconds = 0;
      curAudio.playbackRate = 1;
      curAudio.play();
    } catch (error) {
      console.log('error', error);
    }

  }

  handleResultAudioPlay () {
    try {
      const resultAudio = this.resultRap.audioEl.current;
      this.playSeconds = 0;
      resultAudio.playbackRate = 1;
      resultAudio.play();
    } catch (error) {
      console.log('error', error);
    }

  }


  // 监听播放，控制播放速度(>0 && < 17)
  handleAudioListen (playTime) {
    try {
      console.log('playTime', playTime);
      this.playSeconds += 200;
      const curAudio = this.rap.audioEl.current;
      if (curAudio.playbackRate >= 16) {
        curAudio.playbackRate = 16;
      } else if (curAudio.playbackRate <= 1) {
        curAudio.playbackRate = 1;
      }

      if (this.playSeconds < 1000) {
        curAudio.playbackRate += 1;
      } else if (this.playSeconds < 2000) {
        curAudio.playbackRate += 0;
      } else if (this.playSeconds < 3000) {
        curAudio.playbackRate += 0;
      } else if (this.playSeconds < 4000) {
        curAudio.playbackRate -= 0.25;
      } else if (this.playSeconds < 6800) {
        curAudio.playbackRate -= 0.25;
      } else {
        this.stopAudio();
      }

    } catch (error) {
      console.log('error', error);
    }


  }

  stopAudio () {
    try {
      const curAudio = this.rap.audioEl.current;
      this.playSeconds = 0;
      curAudio.playbackRate = 1;
      curAudio.pause();
    } catch (error) {
      console.log('error', error);
    }

  }

  _renderHeader = () => {
    const { appStore } = this.props
    const {boxStore} = appStore
    return (
      <div className='box-info-header' >
        <p>{boxStore.boxDetailData.name}</p>
      </div>
    )
  }


  _renderBoxTopLine = () => (
    <div className='top-ref'>
      <div className='p-top'>
        <p className='border-top-left'></p>
        <img src={img.icon_kxzzs} />
        <p className='border-top-right'></p>
      </div>
    </div>
  )

  _renderSliderItem = (sliderlist, i) => {
    let slideItemLayout = ''
    let slideItemCon = ''
    switch (this.state.selectBet) {
    case 1:
      slideItemLayout = 'm-slide-item'
      slideItemCon = 'box-slide-item-img-con'
      break;
    case 2:
      slideItemLayout = 'm-slide-item-two'
      slideItemCon = 'box-slide-item-img-con-two'
      break;
    case 3:
      slideItemLayout = 'm-slide-item-three'
      slideItemCon = 'box-slide-item-img-con-three'
      break;
    case 4:
      slideItemLayout = 'm-slide-item-four'
      slideItemCon = 'box-slide-item-img-con-four'
      break;
    case 5:
      slideItemLayout = 'm-slide-item-five'
      slideItemCon = 'box-slide-item-img-con-five'
      break;

    default:
      slideItemLayout = 'm-slide-item'
      break;
    }
    return (
      <div className='box-slide-content'>
        {sliderlist.map((item, i) => (
          <div
            className={`${slideItemLayout} ${item.$rarityBgClass}`}
            key={i}
          >
            <img
              className={slideItemCon}
              src={item.detail.icon_url}
            />
            <div className='m-slide-item-name'>
              <p>{`${item.$firstTypename}  | `}<span>{item.$twoname}</span></p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  _renderBoxBottomLine = () => (
    <div className='bottom-ref'>
      <div className='p-bottom'>
        <p className='border-bottom-left'></p>
        <img src={img.icon_kxzzx} />
        <p className='border-bottom-right'></p>
      </div>
    </div>
  )

  _renderBoxContent = () => {
    const {betList, selectBet, lock} = this.state
    const { appStore } = this.props
    const {boxStore} = appStore
    return (
      <div className='contentlist' >
        <div className='none-border'>
          <img src={boxStore.boxDetailData.cover} className={boxStore.openBoxLoad ? 'swing' : ''} />
          <img src={boxStore.boxDetailData.$showImg} className='show-weapon'/>
        </div>
        <div className='right'>
          <div className='flex'>
            {betList.map((betCount, i) => {
              if (i === 0) {
                return (
                  <p
                    className={[betCount.value === selectBet ? 'left-bgo' : 'left-bg']}
                    key={i}
                    onClick={() => {this.handleBetCount(betCount)}}>
                    <span>{betCount.title}</span>
                    <img src={img.icon_kxslxz} />
                  </p>
                )
              } else if (i === betList.length - 1) {
                return (
                  <p
                    className={[betCount.value === selectBet ? 'right-bgo' : ' right-bg ']}
                    key={i}
                    onClick={() => {this.handleBetCount(betCount)}}>
                    <span>{betCount.title}</span>
                    <img src={img.icon_kxslxz2} />
                  </p>
                )
              } else {
                return (
                  <p
                    className={[betCount.value === selectBet ? 'center-bgo' : ' center-bg']}
                    key={i}
                    onClick={() => {this.handleBetCount(betCount)}}>
                    {betCount.title}
                  </p>
                )
              }
            })}
          </div>
          <div className='button-open'
            onClick={() => {!lock ? this.handleOpenWeapon() : null}}>
            {`$ ${boxStore.boxDetailData.$actualPurchase ? methods.MoneySlice(boxStore.boxDetailData.$actualPurchase * selectBet, false) : 0}`}
          </div>
        </div>
      </div>
    )
  }
  _renderOpenContent = () => {
    const { appStore } = this.props
    const {boxStore} = appStore
    const {selectBet} = this.state
    if (!boxStore.boxType) {
      return (
        <div className='box-info-content'>
          {this._renderBoxTopLine()}
          {this._renderBoxContent()}
          {this._renderBoxBottomLine()}
        </div>
      )
    } else {
      const currentawardGroupList = boxStore.awardGroupList.slice(0, selectBet)
      let openboxLayout = ''
      switch (currentawardGroupList.length) {
      case 1:
        openboxLayout = 'box-open-layout'
        break;
      case 2:
        openboxLayout = 'box-open-layout-two'
        break;
      case 3:
        openboxLayout = 'box-open-layout-three'
        break;
      case 4:
        openboxLayout = 'box-open-layout-four'
        break;
      case 5:
        openboxLayout = 'box-open-layout-five'
        break;

      default:
        openboxLayout = 'box-open-layout'
        break;
      }
      return (
        <div
          className='box-open-box' >
          {currentawardGroupList.map((item, i) => (
            <div className='box-open-bg'  key={i}>
              <div className={openboxLayout}>
                <div className='box-slide-con' >
                  <div className='box-slide-ref' ref={`moveRef${i}`} >
                    {this._renderSliderItem(item, i)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className='box-open-arrow'>
            <img className='box-open-topicon' src={img.icon_kxzzs} />
            <div className='box-open-line' />
            <img className='box-open-bottomicon' src={img.icon_kxzzx} />
          </div>
        </div>
      )
    }
  }

  _renderBody = () => (
    <div className='box-info-body'>
      {this._renderOpenContent()}
    </div>
  )

  render () {
    const { appStore } = this.props
    const {boxStore} = appStore
    return (
      <Spin spinning={boxStore.boxinfoload}>
        <div className='box-info-layout'>
          {this._renderHeader()}
          {this._renderBody()}
          <ReactAudioPlayer
            ref={(element) => {
              this.rap = element;
            }}
            src={openvoice}
            loop
            listenInterval={200}
            onListen={this.handleAudioListen}
          />
          <ReactAudioPlayer
            ref={(element) => {
              this.resultRap = element;
            }}
            src={resultvoice}
            listenInterval={200}
          />
        </div>
      </Spin>
    )
  }

}
BoxInfo.propTypes = {
  appStore: PropTypes.any,
  _id: PropTypes.any,
  cacheLifecycles: PropTypes.any,

};

export default BoxInfo
