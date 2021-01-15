import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import methods from '@utils/methods'
import './index.less'

TweenOne.plugins.push(Children);

const YbMoney = (props) => {
  const { children, size, className, type } = props

  const animation = {
    Children: {
      value: methods.MoneySlice(children),
      floatLength: 2,
      formatMoney: true
    },
    duration: 500,
  }

  const moneyClass = classnames(className, {
    'yb-money': true,
    'small': size === 'small',
    'big': size === 'big',
    'blue': type === 'blue',
    'pink': type === 'pink',
  })

  return (
    <div className={moneyClass}>
      <span className="money-icon">$</span>
      <TweenOne
        animation={animation}
        className='money-num'
        component='span'
      >
        0
      </TweenOne>
      {/* <span className="money-num">{children}</span> */}
    </div>
  )
}

YbMoney.defaultProps = {
  children: 0,
  size: 'default',
  type: 'default',
}

YbMoney.propTypes = {
  children: PropTypes.any,
  // small default big
  size: PropTypes.string,
  // default blue pink
  type: PropTypes.string,
  className: PropTypes.string,
};

export default YbMoney
