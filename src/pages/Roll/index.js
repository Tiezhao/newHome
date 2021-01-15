import './index.less'
import img from '@utils/img'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import { Drawer, Spin, Tabs, Pagination} from 'antd';
import { toJS } from 'mobx';
import methods from '@utils/methods'
import moment from 'moment';
function Roll ({ appStore}) {
  const {activityStore} = appStore
  const {getRollRoom, RollRoomData, rollPageData, rollType, setRollData, setRollType, tabsData} = activityStore
  const {page, limit, type, total, load} = rollPageData
  useEffect(() => {
    getRollRoom()
  }, [])

  console.log('RollRoomData.list', toJS(RollRoomData.list))
  const handleSelected = (val) => {
    setRollType(val)
    setRollData('type', val)
    const parmas = {
      page: 0,
      limit: 6,
      type: rollPageData.type
    }
    getRollRoom(parmas)
  }
  let history = useHistory()
  const handleJump = (_id) => {
    history.push(`/home/rolldetail/${_id}`)
  }
  const pageChange = (val) => {
    setRollData('page', val - 1)
    let params = {
      page: val - 1,
      limit: limit,
      type: type
    }
    getRollRoom(params)
  }
  const RollHeader = () => (
    <div className="roll-header">ROLL福利房间</div>
  )
  const RollTabs = () => (
    <div className='roll-tabs'>
      {tabsData.map((item, i) => (
        <div key={i}  className={`${item.key === rollType  ? 'selected' : null}`}
          onClick={() => {handleSelected(item.key)}}>{item.title}</div>
      ))}
    </div>
  )
  const RollCard = () => (
    <Spin spinning={load}>
      <div className='roll-content'>
        {RollRoomData.list.map((item, j) => (
          <div className='roll-card' key={j}>
            <div className='roll-card-header' style={{
              backgroundImage: `url(${item.poster})`
            }}>
              <div >{item.description}</div>
              <div >开奖时间：{moment(item.stop_time).format('YYYY-MM-DD ')}</div>
            </div>
            <div className='roll-card-info'>
              <div className={`roll-card-weapon ${item.$myrarityBgClass}`} >
                <img src={item.options.roll_items[0].icon_url}/>
              </div>
            </div>
            <div className='roll-card-dec'>
              <div className='roll-card-item'>
                <div className='roll-card-room'>
                  <div>{item.title}</div>
                  <div className='roll-room-price'>房间总价值：<span>{'$'}{methods.MoneySlice(item.options.price_total)}</span></div>
                </div>
                <div className='roll-room-footer'>
                  <div>
                    <img src={img.icon_rofft}/>
                    <span>{'武器个数:'}{item.options.items_total}</span>
                  </div>
                  <div>
                    <img src={img.icon_rofftb} />
                    <span>{'参与人数:'}{item.options.user_total}</span>
                  </div>
                </div>
              </div>
            </div>
            {rollType == 'open'
              ? <div className='roll-card-btn' onClick={() => {handleJump(item._id)}}>我要加入</div>
              : <div className='roll-card-btn'  onClick={() => {handleJump(item._id)}}>查看开奖结果</div>}
          </div>
        ))}
      </div>
    </Spin >
  )
  const  RollFooter = () => (
    <div className='roll-footer-page'>
      <Pagination
        size='small'
        defaultCurrent={page + 1}
        showSizeChanger={false}
        total={total}
        current={page + 1}
        showLessItems
        onChange={(page) => pageChange(page)}
      />
    </div>
  )
  return (

    <div className="roll-box-layout">
      <RollHeader/>
      <RollTabs/>
      <RollCard/>
      {total > 0 ?  <RollFooter/> : null}
    </div>
  )
}

Roll.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(Roll));
