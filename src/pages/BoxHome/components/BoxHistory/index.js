import { observer, inject } from 'mobx-react'
import TweenOne from 'rc-tween-one';
import PropTypes from 'prop-types'
import Button from 'antd/lib/button';
import { toJS } from 'mobx'
import Avatar from '@components/Avatar'
import { useHistory } from 'react-router-dom';
import React, {  useEffect, useState } from 'react'
import './index.less'

const TweenOneGroup = TweenOne.TweenOneGroup;

function BoxHistory ({ appStore }) {

  const [moveX, setMoveX] = useState(0)
  const {boxStore} = appStore
  const { recentUnboxData, switchHDImg, getRecentUnboxList} = boxStore
  useEffect(() => {

    getRecentUnboxList()

  }, [])
  useEffect(() => {
    setMoveX((recentUnboxData.list.length - 20) > 0 ? (recentUnboxData.list.length - 20) * 200 : 0)
    console.log('BoxHistory=========>list', moveX);
  }, [recentUnboxData.list])


  return (
    <div
      style={{position: 'relative'}}
      className='boxhistory-wrap'>
      <TweenOneGroup
        enter={{
          x: -30,
          opacity: 0,
          width: 0,
          type: 'from',
          ease: 'easeOutQuart',
          duration: 500
        }}
        className="gun-box"
      >
        {recentUnboxData.list.map((item, i) => {
          let otherUserInfo = {
            _id: item.user_id,
            avatar: item.user_datail.avatar,
            nickname: item.user_datail.nickname,
          }

          return (
            <div className={`switch ${item.$rarityBgClass}`} key={item.user_item_id}  >
              <div className='show'>
                <img src={switchHDImg(item.item_detail.icon_url)}
                  style={{display: 'block'}}/>
                <p className='weapon-name'>{`${item.$firstTypename} |`}<span>{`${item.$twoname}`}</span></p>
              </div>
              <div className='hide'>
                <Avatar avatarStyle={'avatar-pic'} otherUserInfo={otherUserInfo} showName />
              </div>
            </div>
          )
        })}
      </TweenOneGroup>
    </div>
  )
}

BoxHistory.propTypes = {
  appStore: PropTypes.any,
};

export default inject('appStore')(observer(BoxHistory));
