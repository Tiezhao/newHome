
import React from 'react'
import './index.less'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react'

function Stop ({appStore}) {

  const {configInfo} = appStore
  return (
    <div className='stop-box'>
      <p>{configInfo.remark}</p>

    </div>
  );
}
Stop.propTypes = {
  appStore: PropTypes.any,
};

export default inject('appStore')(observer(Stop));

