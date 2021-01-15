import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import './modal.less'
import img from '@utils/img'
import { Col, Layout, Modal, Row, Drawer, Form, Input, Button} from 'antd';
import Header from '@layouts/Header';
import PagesRouter from '@router/pagesRouter';
import { observer, inject } from 'mobx-react'
import Forget from '@pages/account/Forget';
import Login from '@pages/account/Login';
import Register from '@pages/account/Register';
import Retrieve from '@pages/BoxHome/components/Retrieve'
import Footer from '@layouts/Footer';
import RedEnvelopeReceive from '@pages/RedEnvelope/RedEnvelopeReceive';
import RedEnvelopeRules from '@pages/RedEnvelope/RedEnvelopeRules';
import RedEnvelopeInfo from '@pages/RedEnvelope/RedEnvelopeInfo';
import ServiceModal from '@components/ServiceModal'
import LimitModal from '@components/LimitModal'
import { useHistory } from 'react-router-dom';
function Content ({ appStore, centerStore }) {
  let history = useHistory()
  const { isAuth, modalStore} = appStore
  const { authType, showAuth, setShowAuth, showRetrieve, setShowRetrieve, redEnvelopeType, setRedEnvelopeType, setShowLimit} = modalStore

  const { setCenterType} = centerStore
  useEffect(() => {
    appStore.initApp()
  }, [])
  const [form] = Form.useForm();

  const AuthContent = () => {
    if (authType === 'login') {
      return <Login />
    } else if (authType === 'reg') {
      return <Register />
    } else if (authType === 'forget') {
      return <Forget />
    } else {
      return <Login />
    }
  }
  // 红包
  const RedEnvelopeContent = () => {
    if (redEnvelopeType === 'receive') {
      return < RedEnvelopeReceive/>
    } else if (redEnvelopeType === 'info') {
      return <RedEnvelopeInfo/>
    } else if (redEnvelopeType === 'rules') {
      return <RedEnvelopeRules/>
    } else {
      return  <RedEnvelopeRules/>
    }
  }

  const handleBag = () => {
    if (isAuth) {
      history.push('/home/center/backpack')
      setCenterType('backpack')
    } else {
      // setAuthType('login')
      setShowAuth('login')
    }
  }
  const handleRetrieve = () => {
    if (isAuth) {
      setShowRetrieve(true)
    } else {
      setShowAuth('login')
    }
  }
  const RightDrawer = () => (
    <div className='layout-right-btn'>
      <div className='layout-red-bg' onClick={() => {setShowRedEnvelope(true)}}>
        <img src={img.icon_hbbj} className='red-bag'/>
      </div>
      <div className='layout-back-bg' onClick={() => {
        handleBag()
      }}>
        <img src={img.icon_bbtb} className='bag-img'/>
        <p> 背包</p>
      </div>
      <div onClick={() => {
        handleRetrieve()
      }} className='layout-retrieve-bg'>
        <img src={img.icon_qhtb} className='retrieve-bg'/>
        <p>取回助手</p>
      </div>
    </div>
  )
  const [showRedEnvelope, setShowRedEnvelope] = useState(false)
  const RedEnvelopeModal = () => (
    <Modal
      className='layout-redenvelopemodal-box'
      width={350}
      visible={showRedEnvelope}
      onCancel={() => {setShowRedEnvelope(false), setRedEnvelopeType('receive')}}
      footer={null}
      centered
    >
      <RedEnvelopeContent/>
    </Modal>
  )
  const RetrieveAssistant = () => (
    <Drawer
      placement="right"
      closable={false}
      className='layout-drawer'
      visible={showRetrieve}
      onClose={() => {setShowRetrieve(false)}} >
      <Retrieve />

    </Drawer>
  )
  const AuthModal = () => (
    <Modal
      className='layout-authmodal-box'
      width={470}
      visible={showAuth}
      onCancel={() => {setShowAuth(false)}}
      centered
      footer={null}
    >
      <Layout>
        <AuthContent />
      </Layout>
    </Modal>
  )
  const RightSlider = () => (
    <div>
      <RightDrawer />
      <RetrieveAssistant />
      <ServiceModal/>
    </div>
  )

  return (
    <Layout >
      <Header />
      <div className='layout-box'>
        <Row  type='flex' justify='space-between'>
          <AuthModal />
          <Layout.Content>
            <PagesRouter />
            <RightSlider />
          </Layout.Content>
          <RedEnvelopeModal/>
          <LimitModal/>
        </Row>
        <Footer />
      </div>
    </Layout>

  );
}
Content.propTypes = {
  appStore: PropTypes.object,
  centerStore: PropTypes.any,
};

export default inject('appStore',  'centerStore')(observer(Content));


