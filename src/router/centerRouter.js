
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import lazy from './common'
const charge = lazy(() => import('@pages/Charge'))
const backpack = lazy(() => import('@pages/BackPack'))
const profile = lazy(() => import('@pages/Profile'))
const promotion = lazy(() => import('@pages/Promotion'))
const retrieve = lazy(() => import('@pages/Retrieve'))


class centerRouter extends Component {
  render () {
    return (
      <CacheSwitch>
        <CacheRoute path='/home/center/charge' component={charge} />
        <CacheRoute path='/home/center/backpack' component={backpack} />
        <CacheRoute path='/home/center/profile' component={profile} />
        <CacheRoute path='/home/center/promotion' component={promotion} />
        <CacheRoute path='/home/center/retrieve' component={retrieve} />
        <Redirect from='/home/center' to='/home/center/charge' />
      </CacheSwitch>
    )
  }
}

export default centerRouter
