
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import lazy from './common'
const Stop = lazy(() => import('@pages/Stop'))
const Privacy = lazy(() => import('@pages/Privacy'))
const Activity = lazy(() => import('@pages/Activity'))
class AuthRouter extends Component {
  render () {
    return (
      <Switch>
        <Route path='/auth/stop' component={Stop} />
        <Route path='/auth/privacy' component={Privacy} />
        <Route path='/auth/activity' component={Activity} />
        <Redirect from='/auth' to='/auth/stop' />
      </Switch>
    )
  }
}

export default AuthRouter
