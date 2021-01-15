
import React from 'react'
import Content from '@layouts/Content'
import { Redirect, Route, Switch } from 'react-router-dom'
import AuthRouter from './authRouter'

const Routes = () => (
  <Switch>
    <Route path='/home' component={Content} />
    <Route path='/auth' component={AuthRouter} />
    <Redirect path='/' to='/home' />
  </Switch>
)

export default Routes
