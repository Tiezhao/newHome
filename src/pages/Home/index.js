
import React from 'react'
import './index.less'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
function Home ({ appStore }) {
  let history = useHistory()
  const { isAuth,  setAuth, modalStore} = appStore
  const { showAuth, setShowAuth} = modalStore
  // console.log('appStore1', appStore.testStore);

  return (

    <div className='home-layout'>
      <p onClick={() => {
        console.log('111');
        history.push('/auth/stott')
      }}>{isAuth ? 'true' : 'false'}</p>
      <p>{showAuth ? 'true' : 'false'}</p>
    </div>
  );
}
Home.propTypes = {
  appStore: PropTypes.any,

};

export default inject('appStore')(observer(Home));

