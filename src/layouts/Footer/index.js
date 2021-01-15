
import React, { useState, useContext } from 'react'
import './index.less'
import config from '../../../package.json';
import { Button, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd'
import { useHistory, NavLink} from 'react-router-dom';
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import methods from '@utils/methods'
import img from '@utils/img'
import Avatar from '@components/Avatar'
import { DownOutlined } from '@ant-design/icons';

function Footer ({ appStore }) {
  const history = useHistory()

  const About = () => (
    <div className='layout-about'>
      {/**
     <div className='layout-about-info'>
        <a>2016—2020 DOUSKINS.COM</a>
        <a >WiseAvant OÜ as an administrator of the Website adopts these Terms of
        Use that specifies User’s rights and obligations and constitute a legally
        binding agreement for both parties. These Terms of Use affect User’s ri
        ghts and impose certain obligations while using the Website, so the User
        must read them carefully.
        </a>
      </div>
    */}

      <div className='layout-about-img'>
        <img src={img.icon_payments} />
        <p style={{color: '#fff', marginLeft: '100px'}}>{config.version}</p>
      </div>

    </div>
  )

  return (
    <div className='layout-footer'>
      <About />
    </div>
  );
}
Footer.propTypes = {
  appStore: PropTypes.any,
};

export default inject('appStore')(observer(Footer));
