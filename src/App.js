import React from 'react';
import history from '@router/history'
import { Layout } from 'antd'
import Routes from '@router'
import './App.less';
import stores from './stores'
import { Provider } from 'mobx-react'
import { Router  } from 'react-router-dom'
import { useInvitation } from '@hooks/useInvitation'
import storage from '@utils/storage'

function App () {
  const [referrer] = useInvitation(window.location.href);
  if (referrer) {
    storage.set('douinvitecode', referrer)
  }


  return (
    <Provider {...stores}>
      <Router history={history} forceRefresh>
        <Layout style={{ height: '100%' }}>
          <Routes />
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
