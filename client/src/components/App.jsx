import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import MainNavbar from './MainNavbar'
import Search from './pages/Search'
import Home from './pages/Home'
import TripDetail from './pages/TripDetail'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Test from './pages/Test'

export default function App() {
  return (
    <div className="App">
      <MainNavbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/:trip-detail" component={TripDetail} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/test" component={Test} />
        <Route render={() => <h2>404</h2>} />
      </Switch>
    </div>
  )
}
