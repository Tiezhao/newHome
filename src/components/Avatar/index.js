
import React, { useState, useEffect, useRef} from 'react'
import './index.less'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { useHistory } from 'react-router-dom';
import { useAvatar } from '@hooks/useAvatar'
function Avatar ({ appStore, _id, avatarStyle, showName, nameStyle, otherUserInfo }) {

  let history = useHistory()
  const { isAuth, userInfo} = appStore
  const [imgUrl, userName] = useAvatar(isAuth, userInfo, _id, otherUserInfo || {});

  return (
    <div className='avatar-layout'>
      <img
        className={`avatar-img  ${avatarStyle}`}
        src={imgUrl}
      />
      {showName ? <p className={`${nameStyle}`}>{userName}</p> : null}
    </div>

  );
}
Avatar.propTypes = {
  appStore: PropTypes.any,
  _id: PropTypes.any,
  avatarStyle: PropTypes.any,
  showName: PropTypes.any,
  nameStyle: PropTypes.any,
  otherUserInfo: PropTypes.object,
};

export default inject('appStore')(observer(Avatar));

