import './index.less'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import React, {  useEffect } from 'react'
import {Spin} from 'antd';
import BoxHistory from './components/BoxHistory'
import Notice from '@pages/Notice';
import Banner  from '@pages/Banner';
import methods from '@utils/methods'


function BoxHome ({ appStore }) {

  const {boxStore} = appStore
  const { allTypeBoxsData,  getAllTypeBoxs, boxLoading} = boxStore

  useEffect(() => {
    getAllTypeBoxs()
  }, [])
  let history = useHistory()


  const JumpOpon = (_id) => {
    history.push(`/home/boxopen/${_id}`)
  }
  const BoxGroup = ({typeList}) => {
    BoxGroup.propTypes = {
      typeList: PropTypes.any,
    };
    return (
      <div className='top'>
        {typeList.boxs.length <= 0 ? null : <div className='bg-title'>{typeList.name}</div>}
        <div className='box-group'>
          {typeList.boxs.map((boxItem, i) => {
            const firstImg = boxItem.first_box_item_detail && boxItem.first_box_item_detail.icon_url
            return (
              <div className={boxItem.status === 1 ? 'box' : 'box-null'} key={i} onClick={() => {
                boxItem.status === 1
                  ? JumpOpon(boxItem._id) : null
              }}>
                <img src={boxItem.cover} className='pic'/>
                <img src={firstImg} className='img'/>
                <div className='mini'>{boxItem.name}</div>
                <div className='bg-buy'>{`$ ${methods.MoneySlice(boxItem.$actualPurchase, false)}`}</div>
                {boxItem.hasdis ? <div className='dis-purchase'>{`$ ${methods.MoneySlice(boxItem.purchase, false)}`}</div> : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  const AllComList = () => (
    <Spin spinning={boxLoading}>
      <div className='all-comList'>
        {allTypeBoxsData.list.map((typeList, i) => (
          <BoxGroup key={i} typeList={typeList} />
        ))}
      </div>
    </Spin>
  )


  return (
    <div className="boxhome-layout">
      <BoxHistory/>
      <Notice/>
      <Banner/>
      <AllComList/>
    </div>
  )
}
BoxHome.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(BoxHome));
