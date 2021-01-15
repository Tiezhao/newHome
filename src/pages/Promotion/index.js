
import config from '@configs/config';
import methods from '@utils/methods';
import { Button, Card, Col, Icon, Input, Layout, message, Modal, Progress, Row, Steps } from 'antd';
import copy from 'copy-to-clipboard';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { useState, useContext, useEffect, useRef  } from 'react'
import PropTypes from 'prop-types'
import './index.less';
import { useHistory } from 'react-router-dom';
import img from '@utils/img'
const Step = Steps.Step;

function Promotion ({ appStore}) {
  const scrollRef = useRef()
  const { isAuth, walletInfo, userInfo, teamStore} = appStore
  const { detailData, commisstionData, setCommissionPage, getCommission} = teamStore
  const [listno, setListno] = useState(true)
  const code = detailData.fixed_code
  const pushLink = config.baseUrl() + '?douinvitecode=' + code

  useEffect(() => {
    if (isAuth) {
      getCommission()
    }

  }, [isAuth]);

  const handleCopy = (value) => {
    if (copy(value)) {
      message.success('复制成功')
    } else {
      message.error('复制失败')
    }
  }
  const [showModal, setShowModal] = useState(false)
  const handleModal = () => {
    // setModalType(type)
    setShowModal(true)
  }
  const handleCancel = () => {
    setShowModal(false)
  }
  const handleReceiveIncome = async () => {
    const { teamStore, accountStore } = this.props
    const res = await teamStore.receiveIncome()
    if (res && res.code === 0) {
      message.success('领取成功')
      accountStore.refreshWalletInfo()
    }
  }


  const onScrollEvent = () => {
    console.log('scrollRef', scrollRef.current.scrollTop);
    if (scrollRef.current.scrollTop + scrollRef.current.clientHeight ===
      scrollRef.current.scrollHeight) {

      if (commisstionData.total <= commisstionData.list.length) {
        console.log('没有更多数据');
        setListno(true)
        return
      }

      setCommissionPage('page', parseInt(teamStore.commissionPage.page + 1))
      getCommission()
    }
  }


  const PromoteLinks = () => (
    <div className='promote-links'>
      <div className='promote-address'>
        <div className='promote-title'>
          <img src={img.icon_tglj}/>
          <p className='title-text'>推广链接</p>
        </div>
        <input className='link' disabled type='text' value={pushLink}/>
      </div>
      <div className='copy-btn' onClick={() => handleCopy(pushLink)}>复制</div>
    </div>
  )
  const PromotionCode = () => (
    <div className='promote-code'>
      <div className='promote-postion'>
        <div className='promote-title'>
          <img src={img.icon_tgm}/>
          <p className='title-text'>推广码</p>
        </div>
        <input type='text' disabled className='link' value={code}/>
      </div>
      <div className='copy-btn' onClick={() => handleCopy(code)}>复制</div>
    </div>
  )
  const referNum = detailData.refer_num
  const tamountTotal = methods.MoneySlice(detailData.type101_acc_amount)
  const iamountTotal = methods.millionSlice(detailData.type101_comm_amount)
  const iamountCount = detailData.type101_comm_pct / 10 + '%'
  const Table = () => (
    <div className='promote-table'>
      <div className='table-title'>
        <div>返利</div>
        <div>推广人数</div>
        <div>总充值</div>
        <div>总收益</div>
      </div>
      <div className='table-text'>
        <div>{iamountCount}</div>
        <div>{`${referNum}人`}</div>
        <div>{`$${tamountTotal}`}</div>
        <div>{`$${iamountTotal}`}</div>
      </div>
    </div>
  )
  const Rules = () => (
    <div className='promote-rules'>
      <p>新用户通过您的推广链接或填入邀请码注册并充值成功，您将能获得推广返利。
        <span className='text-color' onClick={handleModal}>&lt;规则明细&gt;</span>
      </p>
      <MyModal/>
      <div className='explain'>
        <div className='center-steps'>
          <img src={img.icon_fxtglj}/>
          <p>分享推广链接</p>
          <div>在Steam或者社群分享自己的邀请链接</div>
        </div>
        <p><img src={img.icon_tgfh}/></p>
        <div className='center-steps'>
          <img src={img.icon_hyczcg}/>
          <p>好友充值成功</p>
          <div>新用户注册并充值</div>
        </div>
        <p><img src={img.icon_tgfh}/></p>
        <div className='center-steps'>
          <img src={img.icon_hdjl}/>
          <p>获得奖励</p>
          <div>佣金奖励立即到账</div>
        </div>
      </div>
    </div>
  )
  const Level = () => (
    <div className='promote-level'>
      <div className='level-that'>等级说明</div>
      <div className='level-title'>
        <p>等级</p>
        <p>佣金比例</p>
        <p>升级要求</p>
      </div>
      <div className='level-status'>
        <p className='level-bg'>1级</p>
        <p>1%</p>
        <p>初始等级</p>
      </div>
      <div className='level-status'>
        <p  className='level-bg'>2级</p>
        <p>2%</p>
        <p>用户累计充值<span className='level-money'>$</span> 5</p>
      </div>
      <div className='level-status'>
        <p  className='level-bg'>3级</p>
        <p>3%</p>
        <p>用户累计充值 <span className='level-money'>$</span> 15</p>
      </div>
      <div className='level-status'>
        <p  className='level-bg'>4级</p>
        <p>4%</p>
        <p>用户累计充值 <span className='level-money'>$</span> 50</p>
      </div>
      <div className='level-status'>
        <p className='level-bg'>5级</p>
        <p>5%</p>
        <p>用户累计充值 <span className='level-money'>$</span> 100</p>
      </div>
    </div>
  )
  const Record = () => (
    <div
      className='promote-record'
      onScrollCapture={() => onScrollEvent()}
      ref={scrollRef} >
      <div className='record-that'>推广记录</div>
      <div className='record-title'>
        <p>推广用户</p>
        <p>推广收入</p>
        <p>充值金额</p>
      </div>
      {commisstionData.list.map((item, i) => (
        <div  key={i} className={[i % 2 == 0 ? 'record-status' : 'record-status-other'].join('')}>
          <p>{item.nickname}</p>
          <p><span className='record-money'>$</span>{methods.millionSlice(item.comm_amount)}</p>
          <p><span className='record-money'>$</span>{methods.MoneySlice(item.amount)}</p>
        </div>
      ))}
      {listno ? <p>没有更多数据</p> : null}
    </div>
  )
  const MyModal = () => (
    <Modal
      visible={showModal}
      onOk={handleModal}
      onCancel={handleCancel}
      footer={null}
    >
      <p>规则明细</p>
      <p className='my-modal'>每个新用户通过推广链接进入网站充值成功，都会给推广人带来固定比例的佣金返利，佣金比例以页面显示为准</p>
    </Modal>
  )
  const Header = () => (
    <div className='promotion-header'>
      <PromoteLinks/>
      <PromotionCode/>
    </div>
  )
  const Body = () => (
    <div>
      <Table/>
      <Rules/>
    </div>
  )
  const Footer = () => (
    <div className='promotion-foot'>
      <Level/>
      <Record/>
    </div>
  )
  return (
    <div className='promotion'>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}
Promotion.propTypes = {
  appStore: PropTypes.any,

};

export default inject('appStore')(observer(Promotion));
