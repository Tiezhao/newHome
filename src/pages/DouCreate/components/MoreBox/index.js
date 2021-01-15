import React, { useState, useEffect, useRef } from 'react'
import { PlusOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import img from '@utils/img'
import YbButton from '@components/YbButton'
import YbMoney from '@components/YbMoney'
import { observer, inject } from 'mobx-react'
import './index.less'

const MoreBox = ({className, boxData = {}, appStore, showBoxInfo}) => {
  const { douStore } = appStore
  const { setBoxList, changeRoundNum } = douStore
  const [addStatus, changeAddStatus] = useState(boxData.check ? 1 : 0) // 0 预览 1 编辑
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.addEventListener('wheel', onWheelInput, false)
    return () => {
      inputRef.current.removeEventListener('wheel', onWheelInput)
    }
  }, [])

  function onWheelInput (e) {
    e = e || window.event;
    if (e.wheelDelta > 0) {
      changeRoundNum(boxData._id, ++boxData.num)
    }
    if (e.wheelDelta < 0) {
      changeRoundNum(boxData._id, --boxData.num)
    }

    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  const checkBox = () => {
    setBoxList(boxData._id, true)
  }

  const closeOne = () => {
    changeAddStatus(0)
    setBoxList(boxData._id, false)
    changeRoundNum(boxData._id, 1)
  }

  return (
    <div className={addStatus === 1 ? `more-box ${className || ''}` : `more-box can ${className || ''}`}>
      {addStatus === 1 && <CloseOutlined onClick={() => closeOne()} className='close-icon' />}
      <div className='detail'>
        <div
          style={{backgroundImage: `url("${boxData.cover}")`}}
          className="gun-wrap"
        >
          {/* <img className='gun-img' src={img.gun} alt=""/> */}
        </div>
        <p className="name">{boxData.name}</p>
        <div className="money">
          <YbMoney size='small'>{boxData.purchase}</YbMoney>
        </div>
        <div style={{display: addStatus === 1 ? 'block' : 'none'}} className="mark-box">
          <MinusOutlined onClick={() => changeRoundNum(boxData._id, --boxData.num)} className='mark-icon' />
          <input
            ref={inputRef}
            value={boxData.num}
            onChange={(val) => changeRoundNum(boxData._id, val.target.value)}
            type="number"
          />
          <PlusOutlined onClick={() => changeRoundNum(boxData._id, ++boxData.num)} className='mark-icon' />
        </div>
      </div>
      <div className='zei'>
        <YbButton
          active
          color='#fff'
          type='pink'
          onClick={() => {
            changeAddStatus(1)
            checkBox()
          }}
        >
          添加
        </YbButton>
        <YbButton
          style={{marginTop: '20px'}}
          active
          type='blue'
          onClick={() => showBoxInfo(boxData)}
        >
          查看
        </YbButton>
      </div>
    </div>
  )
}

MoreBox.defaultProps = {
  status: 0
}

MoreBox.propTypes = {
  className: PropTypes.string,
  boxData: PropTypes.object,
  appStore: PropTypes.object,
  showBoxInfo: PropTypes.func,
};

export default inject('appStore')(observer(MoreBox))

