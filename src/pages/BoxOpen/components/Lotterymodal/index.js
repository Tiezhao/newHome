import './index.less'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import React, { useState, useContext, useEffect, useRef  } from 'react'
import { toJS } from 'mobx';
import img from '@utils/img'
import _ from 'lodash';
import methods from '@utils/methods'
import { Button, Spin, message} from 'antd';
import dealErrCode from '@utils/dealErrCode'
function Lotterymodal ({ appStore }) {


  const {refreshWalletInfo, boxStore, getUserInfoAndWalletInfo, modalStore} = appStore
  const {setShowLimit} = modalStore
  const {
    exchange,
    setBoxResultData,
    boxResultData,
    setBoxType,
    setShowLottery,
    pushExchangePromise,
    getUserData
  } = boxStore


  const handleAllBack = () => {
    setShowLottery(false)
    setBoxType(false)

  }


  const [exchangeload, setExchangeload] = useState(false)

  const removeResultAction = (item) => {
    let newResultData = _.cloneDeep(boxResultData)
    for (let i = 0; i < newResultData.resultList.length; i++) {
      const resultItem = newResultData.resultList[i];
      if (resultItem.user_item_id === item.user_item_id) {
        newResultData.allPrice -= resultItem.exchange_price
        newResultData.resultList.splice(i, 1)
        break
      }
    }
    if (newResultData.resultList.length <= 0) {
      handleAllBack()
    }
    return newResultData

  }

  const handleTaskOrBack = async (item, type) => {
    // 0:回购，1:放入背包
    console.log('item', toJS(item));
    try {
      if (type === 0) {
        let cloneResultData = _.cloneDeep(boxResultData)
        let taskbackItembe = cloneResultData.resultList.find((e) => e.user_item_id  === item.user_item_id)
        if (taskbackItembe) {
          taskbackItembe['recycling'] = true
        }
        setBoxResultData(cloneResultData)
        const res = await exchange(item.user_item_id)
        if (res && res.code === 0) {
          message.success('回收成功')
          refreshWalletInfo()
          getUserData()
          setBoxResultData(removeResultAction(item))
        } else {
          dealErrCode.dealBoxErrCode(res.code)
        }
      } else if (type === 1) {
        setBoxResultData(removeResultAction(item))
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const taskAll = async () => {
    let allUserItemIDs = []
    for (let i = 0; i < boxResultData.resultList.length; i++) {
      const resultItem = boxResultData.resultList[i];
      allUserItemIDs.push(resultItem.user_item_id)
    }

    let promiseList =  pushExchangePromise(allUserItemIDs)
    setExchangeload(true)
    Promise.all(promiseList).then((result) => {
      setExchangeload(false)
      if (result) {
        for (let i = 0; i < result.length; i++) {
          const res = result[i];
          if (res && res.code === 0) {

            setBoxResultData({
              allPrice: 0,
              resultList: []
            })
            handleAllBack()
            console.log('handleAllBack');
          } else {
            handleAllBack()
            dealErrCode.dealBoxErrCode(res.code)
          }
        }
        getUserData()
        refreshWalletInfo()
        message.success('回收成功')
      }
    })
  }


  const  ResultBody = ({item, index}) => {
    ResultBody.propTypes = {
      item: PropTypes.any,
      index: PropTypes.any,
    };
    let  haslotOf = index > 0 ? 'boxinfo-result-itemlist' : ''
    return (
      <div className={`boxinfo-result-item ${haslotOf}`}>
        <div className={`result-item-top ${item.$rarityBgClass}`}>
          <img src={item.detail.icon_url}/>
          <p>{`${item.$firstTypename}  | `}<span>{item.$twoname}</span></p>
        </div>
        <div className='result-item-footer'>
          <Button loading={item.recycling} className='result-item-recycling'
            onClick={() => {
              handleTaskOrBack(item, 0)
            }}>{`回收($${methods.MoneySlice(item.exchange_price, false)})`}</Button>

          <Button disabled={item.recycling} className='result-item-tackback'
            onClick={() => {
              handleTaskOrBack(item, 1)
            }}>放入背包</Button>
        </div>
      </div>
    )
  }

  const Body = () => (
    <div className='boxinfo-modal-body'>
      <img src={img.icon_hsbj} className='boxinfo-modal-bg'/>
      {boxResultData.resultList.map((item, i) => (
        <div className='boxinfo-body-content' key={i}>
          <ResultBody item={item} index={i} />
        </div>
      ))}
    </div>
  )

  const Footer = () => (
    <div className='boxinfo-modal-footer'>
      <div className='all-sell'
        onClick={handleAllBack}>
        <p>放入背包</p>
      </div>
      <div className='all-back'  onClick={taskAll}>
        <p>全部回收</p>
      </div>
    </div>

  )


  return (

    <div className='boxinfo-modal-layout'>
      <Spin spinning={exchangeload}>
        <Body />
        <Footer />
      </Spin>
    </div>


  )
}
Lotterymodal.propTypes = {
  appStore: PropTypes.any,
};
export default inject('appStore')(observer(Lotterymodal));
