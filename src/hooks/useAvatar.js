
import  { useState, useEffect } from 'react'
import api from '@configs/api'
import service from '@service'
import methods from '@utils/methods'

export  const useAvatar = (isAuth, userInfo, _id, otherUserInfo) => {
  const defaultImg = require('@images/avatar/tx_00.jpg')
  const steamNoUrl = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg'

  const [imgSrc, setImgSrc] = useState(defaultImg);
  const [userName, setUserName] = useState('');
  const  queryImg = async (_id) => {
    const params = {
      page: 0,
      limit: 10,
      queryGroup: `[["_id","in",["${_id}"]]]`,
      searchTypes: '_id:object_id'
    }
    const res = await service.request(api.user.userDetailByUserIds(), 'GET', params)
    try {

      if (res && res.code === 0) {
        if (res.data.list.length > 0) {
          const resImgUrl = res.data.list[0].avatar
          const nickname = res.data.list[0].nickname
          setUserName(nickname)
          if (resImgUrl.indexOf('http') !== -1 && resImgUrl !== steamNoUrl) {
            setImgSrc(resImgUrl)
          } else {
            let userId = userIdSwitch(_id)

            setImgSrc(require(`@images/avatar/tx_${userId}.jpg`))
          }
        } else {
          setImgSrc(defaultImg)
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const userIdSwitch = (_id) => {

    try {
      let userId = _id
      userId = userId.substring(userId.length - 3)

      let charUserId = 0
      for (let i = 0; i < userId.length; i++) {
        // console.log('aaa', userId.charAt(i).charCodeAt());
        charUserId += userId.charAt(i).charCodeAt()
      }

      charUserId = charUserId % 80
      if (charUserId < 10) {
        charUserId = '0' + charUserId
      }
      console.log('charUserId', charUserId);
      return charUserId
    } catch (error) {
      console.log('error', error);

    }

  }


  useEffect(() => {
    if (methods.checkNullObj(otherUserInfo)) {
      let userId = otherUserInfo._id || ''
      const steamUrl = otherUserInfo.avatar || ''
      const name = otherUserInfo.nickname || ''
      setUserName(name)
      if (steamUrl) {
        if (steamUrl === steamNoUrl) {
          setImgSrc(defaultImg)
        } else {
          setImgSrc(steamUrl)
        }
      } else if (userId) {
        userId = userIdSwitch(userId)
        setImgSrc(require(`@images/avatar/tx_${userId}.jpg`))
      }
    } else if (_id) {
      queryImg(_id)
    } else if (isAuth) {
      if (!methods.checkNullObj(userInfo)) {return;}
      let userId = userInfo._id
      const steamUrl = userInfo.avatar
      if (steamUrl) {
        if (steamUrl === steamNoUrl) {
          setImgSrc(defaultImg)
        } else {
          setImgSrc(steamUrl)
        }
      } else if (userId) {

        userId = userIdSwitch(userId)
        setImgSrc(require(`@images/avatar/tx_${userId}.jpg`))
      }
    }
  }, [userInfo]);

  return [imgSrc, userName];
};


