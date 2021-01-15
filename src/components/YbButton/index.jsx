import React from 'react'
import PropTypes from 'prop-types'
import TweenOne from 'rc-tween-one'
import classnames from 'classnames'
import './index.less'

const YbButton = (props) => {
  const { className, type, children, active, color, disabled, loading, style } = props

  const btnClass = classnames(className, {
    'btn-wrap common': true,
    'blue': type === 'blue',
    'pink': type === 'pink',
    'diff': type === 'diff',
    'disabled': disabled || loading,
    'active': active
  })

  const onPropsClick = () => {
    if (disabled) {return}
    props.onClick()
  }

  return (
    <div style={style} onClick={onPropsClick} className={btnClass}>
      <div style={{color}} className="btn-nei common">
        {loading && (
          <TweenOne
            animation={{
              rotate: '360deg',
              repeat: -1,
              ease: 'linear',
              duration: '1000'
            }}
            style={{transformOrigin: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
            <svg
              t="1608104199727"
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4164"
              width="16"
              height="16"
            >
              <path
                d="M204.8 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
                fill="#ffffff"
                p-id="4165"
              ></path>
              <path
                d="M819.2 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
                fill="#ffffff"
                p-id="4166"
              ></path>
              <path
                d="M819.2 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
                fill="#ffffff"
                p-id="4167"
              ></path>
              <path
                d="M204.8 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
                fill="#ffffff"
                p-id="4168"
              ></path>
            </svg>
          </TweenOne>
        )}
        <p style={{marginLeft: loading ? 10 : 0}}>{children}</p>
      </div>
    </div>
  )
}

YbButton.defaultProps = {
  type: 'default',
  children: '请输入Button内容',
  onClick: () => {}
}

YbButton.propTypes = {
  // 'default' | 'blue' | 'pink' | 'diff'
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.string,
  color: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object
};

export default YbButton
