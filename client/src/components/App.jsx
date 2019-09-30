import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import MainNavbar from './MainNavbar'
import Search from './pages/Search'
import TripDetail from './pages/TripDetail'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Test from './pages/Test'
import api from './../api'

export default function App() {
  //state trip
  const [trip, setTrip] = useState({
    origin: '',
    destination: '',
    transports: [],
    return: true,
    errorMsg: '',
  })

  function handleChange(event) {
    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value
    setTrip({ ...trip, [event.target.name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    api
      .getEveryAnswer(trip.origin, trip.destination)
      .then(res => {
        console.log('res', res)
        if (res.err) {
          setTrip({ ...trip, errorMsg: res.err })
        } else setTrip({ ...trip, transports: res })
      })
      .catch(err => console.log(err))
  }

  //state saved user trips
  const [savedTrip, setSavedTrip] = useState({
    previousSaved: [],
    newSaved: [],
  })

  useEffect(() => {
    if (!savedTrip.newSaved.length) return
    api
      .savedTrips(savedTrip)
      .then(res => {
        console.log('SAVED TRIP!!!', res)
      })
      .catch(err => console.log(err))
  }, [savedTrip])

  useEffect(() => {
    if (!api.isLoggedIn()) return
    api
      .getSavedTrip()
      .then(res => {
        setSavedTrip({ ...savedTrip, previousSaved: res })
      })
      .catch(err => console.log(err))
  }, [])

  function handlesaveTrip(i) {
    if (!api.isLoggedIn()) return
    setSavedTrip({
      ...savedTrip,
      newSaved: [
        {
          origin: trip.origin.toUpperCase(),
          destination: trip.destination.toUpperCase(),
          mode: trip.transports[i].mode.toUpperCase(),
          time: trip.transports[i].time,
          distance: trip.transports[i].distance,
          carbon: trip.transports[i].carbon,
          return: trip.return,
          recurrence: 1,
        },
      ],
    })
  }

  function handleAddTrip(i) {}

  return (
    <div className="App">
      <MainNavbar />
      <Switch>
        <Route
          path="/"
          exact
          render={() => (
            <Search
              trip={trip}
              savedTrip={savedTrip}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClickSave={handlesaveTrip}
              onClickAdd={handleAddTrip}
            />
          )}
        />
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
