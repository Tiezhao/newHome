import './index.less'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import React, { useState, useContext, useEffect, useRef  } from 'react'
import { Spin} from 'antd';

function GoodsList ({ appStore}) {

  const {boxStore} = appStore

  const { boxDetailData, boxinfoload, switchHDImg} = boxStore


  return (
    <Spin spinning={boxinfoload}>
      <div className='weapon-list'>
        <div className='weapon-title'>武器列表</div>
        <div className='weapon-out'>
          {boxDetailData.box_items.map((item, i) => (
            <div className={`weapon-box ${item.$rarityBgClass}`}  key={i}>
              <div className='list-header'>
                <div className='box-title'>
                  <span className='probability'>概率:</span>
                  <span className='rate'>{item.show_winning_rate}%</span>
                </div>
                <div className='box-type'>
                  <p>{item.$exterior.name}</p>
                </div>
              </div>
              <img src={switchHDImg(item.detail.icon_url)}/>
              <p>{`${item.$firstTypename}  | `}<span>{item.$twoname}</span></p>
            </div>
          ))}
        </div>
      </div>
    </Spin>

  )
}
GoodsList.propTypes = {
  appStore: PropTypes.any,
  itemList: PropTypes.any,
};
export default inject('appStore')(observer(GoodsList));
