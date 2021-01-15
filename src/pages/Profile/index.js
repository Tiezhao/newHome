
import React, { useState, useEffect, useRef } from 'react'
import './index.less'
import { observer, inject } from 'mobx-react'
import { Col,  Layout, Menu, Row, Pagination, Spin, Button, Input, Card, message, Modal, } from 'antd';
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { toJS } from 'mobx';
import methods from '@utils/methods'
import Avatar from '@components/Avatar'
import config from '@configs/config';
import dealErrCode from '@utils/dealErrCode'
import { SoundOutlined, LinkOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';

function Profile ({ appStore, centerStore }) {
  let history = useHistory()
  const { isAuth, walletInfo, modalStore, userInfo, teamStore, boxStore} = appStore

  const {
    stramUserInfo,
    setUserInfo,
    getSteamUserInfo,
    backPageData} = boxStore

  const { setCenterType } = centerStore

  const { showAuth, setShowAuth } = modalStore
  const {detailData} = teamStore
  const [tradingLink, setTradingLink] = useState('')
  const [ref, setRef] = useState(null);
  const balance = methods.MoneySlice(walletInfo.balance, false)

  let nickName = userInfo.nickname ? userInfo.nickname : ''
  if (nickName.length > 10) {
    nickName = nickName.substring(0, 10)
    nickName = `${nickName}...`
  }
  const code = userInfo.related_ids.invite_id

  const pushLink = config.baseUrl() + '?douinvitecode=' + code
  useEffect(() => {
    console.log('Profile');
  });
  const { register, handleSubmit, errors, setValue } = useForm();


  if (stramUserInfo.steam.trans_link) {
    setValue('stramurl', stramUserInfo.steam.trans_link)
  }


  const Info = () => (
    <div className='profile-info-layout'>
      <div className='info-img'>
        <Avatar avatarStyle={'profile-style'}  />
      </div>
      <p className='info-name'>{nickName}</p>
      <p className='info-balance'><span>$: </span>{String(balance)}</p>
      <div onClick={() => {
        setCenterType('charge')
        history.push('/home/center/charge')
      }} className='charge-btn'>充值+</div>
    </div>
  )

  const handleCopy = (value) => {
    if (copy(value)) {
      message.success('复制成功')
    } else {
      message.error('复制失败')
    }
  }

  const onSubmit = async (data) => {

    // eslint-disable-next-line no-useless-escape
    const steamLinkReg = /^https\:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner\=([0-9]+)\&token\=(\S+)/;
    data.stramurl = data.stramurl.replace(/\s/g, '')
    if (steamLinkReg.test(data.stramurl)) {
      const params = {
        steam: {
          trans_link: data.stramurl
        }
      }
      const res = await setUserInfo(params)
      if (res.code === 0 || res.code === 30) {
        getSteamUserInfo()
        message.success('修改成功')
      } else {
        dealErrCode.dealSteamErrCode(res.code)
      }
    } else {
      message.error('steam链接格式不正确')
    }
  };

  const ChangeLink = async (val) => {
    console.log('rere', val.target.value);
    setValue('stramurl', val.target.value)

  }

  const LinkInfo = () => (
    <div className='profile-link-layout'>
      <div className='promote-link-layout'>
        <div className='link-input'>
          <div className='link-info'>
            <SoundOutlined />
            <p>推广链接</p>
          </div>
          <Input disabled value={pushLink} />
        </div>
        <div className='link-btn' onClick={() => {handleCopy(pushLink)}}>
          <p>复制</p>
        </div>
      </div>
      <Spin spinning={backPageData.steamLoad}>
        <div className='promote-link-layout'>
          <div className='link-input-form'>
            <div className='link-info'>
              <LinkOutlined />
              <p>取回交易链接</p>
            </div>
            <div className='link-form'>
              <form onSubmit={handleSubmit(onSubmit)} >
                <input placeholder='请填写您的交易链接' onChange={ChangeLink} name='stramurl' defaultValue={stramUserInfo.steam.trans_link} ref={register}
                  οnkeyup="this.value=this.value.replace(/\s+/g,'')" />
                <input value='保存'   className='link-btn' type="submit"/>
              </form>
            </div>
          </div>
        </div>
      </Spin>

      <p>获取交易链接（需打开加速器）</p>
    </div>
  )
  return (
    <div className='profile-layout'>
      <Info />
      <LinkInfo />
    </div>
  );
}
Profile.propTypes = {
  appStore: PropTypes.any,
  centerStore: PropTypes.any,
};

export default inject('appStore',  'centerStore')(observer(Profile));


