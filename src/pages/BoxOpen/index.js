import './index.less'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import React, { useState,  useEffect } from 'react'
import BoxInfo from './components/Boxinfo'
import Goodslist from './components/goodsList'
import Lotterymodal from './components/Lotterymodal'
import { Anchor } from 'antd';
const { Link } = Anchor;

function BoxOpen ({  appStore, match }) {

  const { boxStore } = appStore
  const { getBoxDetailData, showLottery} = boxStore

  useEffect(() => {
    getBoxDetailData(match.params._id)
  }, [match.params._id])
  return (
    <div className="box-open">
      <BoxInfo _id={match.params._id}  />
      <Goodslist/>
      {showLottery ? <Lotterymodal /> : null}
    </div>

  )
}
BoxOpen.propTypes = {
  appStore: PropTypes.any,
  match: PropTypes.any,
};
export default inject('appStore')(observer(BoxOpen));
