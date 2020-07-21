import React, { Fragment } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/login/Login'
import RecoverPassword from './components/login/RecoverPassword'
import Movie from './components/movie/Movie'
import Profile from './components/profile/Profile'
import GuestProfile from './components/profile/GuestProfile'
import Player from './components/movie/Player'
import PrivateRoute from './components/auth/PrivateRoute'
import NotFound from './components/404/NotFound'
import CustomRoute from './components/auth/CustomRoute'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { API } from './config'

const Routes = () => {
  if (API === undefined) {
    console.error('API address is not set')
    return <Fragment></Fragment>
  }

  let jwt = JSON.parse(localStorage.getItem('jwt'))
  if (jwt && jwt.token) {
    console.log(jwt.user._lg)
  }
  return (
    <Fragment>
      <ReactNotification />
      <BrowserRouter>
        <Switch>
          <CustomRoute path="/" exact></CustomRoute>
          <Route path="/login" exact component={Login}></Route>;
          <Route path="/profile/:id" exact component={GuestProfile}></Route>;
          <Route path="/player/:id" exact component={Player}></Route>;
          <Route
            path="/recoverPassword"
            exact
            component={RecoverPassword}
          ></Route>
          <PrivateRoute path="/movie" exact component={Movie}></PrivateRoute>
          <PrivateRoute
            path="/profile"
            exact
            component={Profile}
          ></PrivateRoute>
          <Route path="" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  )
}

export default Routes
