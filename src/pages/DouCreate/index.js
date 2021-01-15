import React, { useState, useEffect } from 'react'
import { Switch, Modal, Spin } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import MoreBox from './components/MoreBox'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import YbButton from '@components/YbButton'
import YbMoney from '@components/YbMoney'
import history from '@router/history'
import methods from '@utils/methods'

import './index.less'

const DouCreate = ({ appStore }) => {

  const { douStore } = appStore

  const { roomForm, setRoomForm, boxList, getAsyncBoxList, roundNum, roundMoney, createAsyncRoom, createLoading, getBoxGunList, gunListLoad, boxGunList } = douStore

  const [showAddBox, toggleShowAdd] = useState(false)

  const [showBoxInfo, toggleShowBoxInfo] = useState(false)

  const [search, changeSearch] = useState('')

  useEffect(() => {
    getAsyncBoxList()
  }, [])

  const searchAsync = () => {
    getAsyncBoxList(search)
  }

  const _renderCreateRoom = () => (
    <div className="create-room">
      <div className="item">
        {/* <p className="item-title">私人房间</p>
        <div className="i-content">
          <Switch
            className='self-switch'
            size='default'
            defaultChecked
            checkedChildren="yes" unCheckedChildren="no"
          />
        </div> */}
      </div>
      <div className="item">
        <p className="item-title">玩家</p>
        <div className="i-content">
          <div onClick={() => setRoomForm('mode', 2)} className={roomForm.mode === 2 ? 'num active' : 'num'}>2</div>
          <div onClick={() => setRoomForm('mode', 3)} className={roomForm.mode === 3 ? 'num active' : 'num'}>3</div>
          <div onClick={() => setRoomForm('mode', 4)} className={roomForm.mode === 4 ? 'num active' : 'num'}>4</div>
        </div>
      </div>
      <div className="item">
        <p className="item-title">总共价格</p>
        <div className="i-content">
          <div className="count">
            <YbMoney>{roundMoney}</YbMoney>
          </div>
        </div>
      </div>
      <div className="item">
        <p className="item-title">回合</p>
        <div className="i-content">
          <p className="round">{roundNum}</p>
        </div>
      </div>
      <YbButton
        loading={createLoading}
        onClick={methods.debounce(createAsyncRoom)}
        disabled={roundNum < 1}
        type='pink'
        active
        color='#fff'
      >
        创建房间
      </YbButton>
    </div>
  )

  const findBoxInfo = (val) => {
    toggleShowBoxInfo(true)
    getBoxGunList(val._id)
    console.log('====================================');
    console.log('val', toJS(val));
    console.log('====================================');
  }

  const _renderAddModel = () => (
    <Modal
      destroyOnClose
      title="添加箱子"
      wrapClassName='add-box-model'
      width='800px'
      visible={showAddBox}
      onCancel={() => toggleShowAdd(false)}
      footer={null}
    >
      <div className="add-content">
        <div className="add-top">
          <div className="t-left">
            箱子正在被添加：
            <p>${methods.MoneySlice(roundMoney)}</p>
          </div>
          <div className="t-right">
            <input onInput={(val) => changeSearch(val.target.value)} type="text" placeholder='搜索箱子' />
            <SearchOutlined onClick={searchAsync} style={{fontSize: '18px'}} className='search-icon' />
          </div>
        </div>
        <div className="add-center-wrap">
          <div className="add-center">
            {boxList.map((e) => (
              <MoreBox showBoxInfo={findBoxInfo} key={e._id} boxData={e} />
            ))}
          </div>
        </div>
        <YbButton onClick={() => {toggleShowAdd(false)}} className='finish-btn' type='pink' color='#fff' >完成</YbButton>
      </div>
    </Modal>
  )

  const _renderBoxInfoModel = () => (
    <Modal
      destroyOnClose
      title="查看箱子"
      wrapClassName='box-info-model'
      width='800px'
      visible={showBoxInfo}
      onCancel={() => toggleShowBoxInfo(false)}
      footer={null}
    >
      <Spin wrapperClassName='box-spin' spinning={gunListLoad}>
        <div className="info-content">
          <div className="info-center-wrap">
            <div className="info-center">
              <div
                className="gun-list"
              >
                {boxGunList.map((e, i) => {
                  if (!e) {return null}
                  return (
                    <div key={i
                    } className='gun-item'>
                      <div className={`gun-inner ${e.$rarityBgClass}`}>
                        <img
                          className='gun-img'
                          style={{margin: douStore.roomDetail.mode === 4 ? '16% auto 0px' : '20% auto 10px'}}
                          src={e.detail.icon_url}
                          alt=""
                        />
                        <p className={douStore.roomDetail.mode === 4 ? 'gun-name text-hidden' : 'gun-name'}>{e.$firstTypename} | <span>{e.$twoname}</span></p>
                        <p className="icon-text-l">
                          <span className='probability'>概率:</span>
                          <span className='rate'>{e.show_winning_rate}%</span>
                        </p>
                        <p className="icon-text-r">{e.$exterior.name}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <YbButton onClick={() => {toggleShowBoxInfo(false)}} className='finish-btn' type='pink' color='#fff' >返回</YbButton>
        </div>
      </Spin>
    </Modal>
  )

  return (
    <div className='creat-fight-container'>
      {_renderAddModel()}
      {_renderBoxInfoModel()}
      <div className='fight-top'>
        <div className="big-title">斗箱大厅</div>
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
        </div>
        <div className="creat-main">
          {_renderCreateRoom()}
          <ul className="box-content">
            {boxList.map((e) => {
              if (e.check) {
                return (
                  <MoreBox
                    key={e._id}
                    showBoxInfo={findBoxInfo}
                    className='check-gun-box'
                    status={1}
                    boxData={e}
                  />
                )
              }
            })}
            <li onClick={() => {toggleShowAdd(true)}} className="add-box">
              <PlusOutlined className='add-icon' />
              <p className="add-text">添加箱子</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

DouCreate.propTypes = {
  appStore: PropTypes.any,
};


export default inject('appStore')(observer(DouCreate))

