import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { observer, inject } from 'mobx-react'
import Avatar from '@components/Avatar'
import moment from 'moment';
import { toJS } from 'mobx'


function RedEnvelopeInfo ({ appStore}) {
  const {activityStore, modalStore, getUserInfoAndWalletInfo} = appStore
  const {redEnvelopeType, setRedEnvelopeType} = modalStore

  const {getActivityUserJoin, RedEnvelopeInfoData, getRedEnvelopeInfo} = activityStore

  useEffect(() => {
    // getUserInfoAndWalletInfo()
  }, [])
  return (
    <div className='red-envelope-info'>
      <div className='red-envelope-header'>
        <Avatar avatarStyle={'red-envelope-style'}/>
      </div>
      <p className='qq-ground'>QQ群加群福利</p>
      {RedEnvelopeInfoData.show_type === 0 ? <p className='lucky-money'>{'$'}{RedEnvelopeInfoData.amount / 100}</p> : null}
      {RedEnvelopeInfoData.show_type === 1 ? <p className='lucky-money'>您已领取过此红包</p> : null}
      {RedEnvelopeInfoData.show_type === -1 ? <p className='lucky-money'>此红包已领完</p> : null}
      <p className='red-info-status'>硬币已存入余额，可用于参与各种活动</p>
      <div className='red-info-list'>
        <div className='red-info-body'>
          {RedEnvelopeInfoData.users.map((item, i) => {
            let otherUserInfo = {
              _id: item.user_id,
              avatar: item.avatar,
            }
            return (
              <div className='red-info-card' key={i}>
                <Avatar avatarStyle={'winner-avatar'} otherUserInfo={otherUserInfo} />
                <div>
                  <p>{item.nickname}</p>
                  <p className='red-info-time'>{moment(item.time).format('YYYY-MM-DD HH:mm')}</p>
                </div>
                <p>{'$'}{item.amount / 100}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='red-goback-rules'>
        <div onClick={() => {setRedEnvelopeType('rules')}} className='red-goback-btn'> 口令红包规则</div>
      </div>
    </div>
  )
}
RedEnvelopeInfo.propTypes = {
  appStore: PropTypes.any,
};

export default inject('appStore')(observer(RedEnvelopeInfo));
