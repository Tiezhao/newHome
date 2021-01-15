
import React, { Component } from 'react'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { Redirect, Route } from 'react-router-dom'
import lazy from './common'
const Home = lazy(() => import('@pages/Home'))
const Center = lazy(() => import('@pages/Center'))
const BoxOpen = lazy(() => import('@pages/BoxOpen'))
const BoxHome = lazy(() => import('@pages/BoxHome'))
const DouBox = lazy(() => import('@pages/DouBox'))
const DouCreate = lazy(() => import('@pages/DouCreate'))
const DouOpen = lazy(() => import('@pages/DouOpen'))
const Roll = lazy(() => import('@pages/Roll'))
const RollDetail = lazy(() => import('@pages/RollDetail'))
class PagesRouter extends Component {
  render () {
    return (
      <CacheSwitch>
        <CacheRoute path='/home/boxhome' component={BoxHome} />
        <Route path='/home/boxopen/:_id' component={BoxOpen}/>
        <CacheRoute path='/home/doubox' component={DouBox} />
        <CacheRoute path='/home/createdou' component={DouCreate} />
        <CacheRoute path='/home/douopen/:id' component={DouOpen} />
        <CacheRoute path='/home/center' component={Center} />
        {/** <CacheRoute path='/home/roll' component={Roll} /> */}
        {/** <CacheRoute path='/home/rolldetail/:_id' component={RollDetail}/> */}
        <CacheRoute path='/home/home' component={Home}/>
        <Redirect from='/home' to='/home/boxhome'/>
      </CacheSwitch>
    )
  }
}
export default PagesRouter
