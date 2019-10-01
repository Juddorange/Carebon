import React, { useState, useEffect } from 'react'
import api from '../../api'

export default function Search(props) {
  function timeConvert(n) {
    var num = n
    var hours = num / 60
    var day = hours / 24
    var hour = hours - 24 * day
    var rhours = Math.floor(hours)
    var rhour = Math.floor(hour)
    var minutes = (hours - rhours) * 60
    var rminutes = Math.round(minutes)
    var rday = Math.round(day)
    if (rday > 1 && rhour > 0)
      return rday + ' days ' + rhour + ' h ' + rminutes + ' min '
    if (rday > 1 && rhour === 0) return rday + ' days ' + rminutes + ' min '
    if (rhours > 24 && rhour > 0)
      return rday + ' day ' + rhour + ' h ' + rminutes + ' min '
    if (rhours > 24 && rhour === 0) return rday + ' day ' + rminutes + ' min '
    else if (rhours > 0) return rhours + ' h ' + rminutes + ' min'
    else return rminutes + ' min'
  }

  //state trip
  const [trip, setTrip] = useState({
    origin: '',
    destination: '',
    frequency: 0,
    period: '',
    transports: [],
    return: false,
    errorMsg: '',
  })

  let transports = trip.transports

  function handleChange(event) {
    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value
    setTrip({ ...trip, [event.target.name]: value })
  }

  function handleSubmit(event) {
    console.log('previous', previousSavedTrip)
    event.preventDefault()
    Promise.all([
      api.getEveryAnswer(trip.origin, trip.destination),
      api.getSavedTrip(),
    ])
      .then(values => {
        if (values[0].err) {
          setTrip({ ...trip, errorMsg: values[0].err })
        } else {
          let searchedTrips = values[0]
          let savedTrips = values[1]
          // for (let i = 0; i < searchedTrips.length; i++) {
          //   for (let j = 0; j < savedTrips.length; j++)
          //     if (
          //       searchedTrips[i].mode === savedTrips[j].transport &&
          //       trip.origin === savedTrips[j].departure &&
          //       trip.destination === savedTrips[j].arrival
          //     ) {
          //       if (
          //         (trip.return === true &&
          //           savedTrips[j].returnTrip === 'RETURN TRIP') ||
          //         (trip.return === false &&
          //           savedTrips[j].returnTrip === 'ONE WAY')
          //       ) {
          //         searchedTrips[i].visited = true
          //       }
          //     }
          // }
          // console.log('searchtrips', searchedTrips)
          setTrip({ ...trip, errorMsg: '', transports: searchedTrips })
          setPreviousSavedTrip(savedTrips)
        }
      })
      .catch(err => console.log(err))
  }

  //state saved user trips
  const [savedTrip, setSavedTrip] = useState([])
  const [previousSavedTrip, setPreviousSavedTrip] = useState([])

  useEffect(() => {
    if (!savedTrip.length) return
    api
      .savedTrips(savedTrip)
      .then(res => {
        console.log(res)
        console.log('previous', previousSavedTrip)
      })
      .catch(err => console.log(err))
  }, [savedTrip])

  useEffect(() => {
    if (!api.isLoggedIn()) return
    api
      .getSavedTrip()
      .then(res => {
        setPreviousSavedTrip(res)
      })
      .catch(err => console.log(err))
  }, [])

  function handlesaveTrip(i) {
    if (!api.isLoggedIn()) return
    else {
      setSavedTrip([
        ...savedTrip,
        {
          origin: trip.origin.toUpperCase(),
          destination: trip.destination.toUpperCase(),
          mode: trip.transports[i].mode.toUpperCase(),
          time: timeConvert(trip.transports[i].time),
          distance: trip.transports[i].distance,
          carbon: trip.transports[i].carbon,
          return: trip.return,
          frequency: trip.frequency,
          period: trip.period,
        },
      ])
      console.log('state savedTrip', savedTrip)
    }
  }

  function displayMode(mode) {
    if (mode === 'Car') return <i className="fas fa-car" />
    else if (mode === 'Train') return <i className="fas fa-train" />
    else if (mode === 'Bicycle') return <i className="fas fa-biking" />
    else return <i className="fas fa-walking" />
  }

  return (
    <div className="Home">
      <h2>TRACK A JOURNEY</h2>
      <form action="" onSubmit={handleSubmit} className="searchForm">
        <input
          className="searchInput"
          type="text"
          name="origin"
          value={trip.origin}
          onChange={handleChange}
          placeholder="Departure"
        />
        <input
          className="searchInput"
          type="text"
          name="destination"
          value={trip.destination}
          onChange={handleChange}
          placeholder="Destination"
        />
        <div className="checkbox">
          <label className="labelCheckbox">Return Trip</label>
          <input
            type="checkbox"
            name="return"
            value={trip.return}
            id="return"
            onChange={handleChange}
          />
        </div>
        <div id="frequency">
          <label htmlFor="">Frequency:</label>
          <input
            className="frequencyInput"
            value={trip.frequencyNumber}
            name="frequency"
            type="number"
            required
            onChange={handleChange}
          />
          Day
          <input
            type="radio"
            name="period"
            value="DAY"
            onChange={handleChange}
          />
          Week
          <input
            type="radio"
            name="period"
            value="WEEK"
            onChange={handleChange}
          />
          Month
          <input
            type="radio"
            name="period"
            value="MONTH"
            onChange={handleChange}
          />
          {/* Week
          <input
            className="frequencyInput"
            value={trip.frequencyWeek}
            name="frequencyWeek"
            type="number"
            onChange={handleChange}
          />
          Month
          <input
            className="frequencyInput"
            value={trip.frequencyMonth}
            name="frequencyMonth"
            type="number"
            onChange={handleChange}
          /> */}
        </div>
        <button className="searchBtn">GO</button>
      </form>
      <div className="tripsAnswer">
        {trip.errorMsg ? <p className="errorSearch">{trip.errorMsg}</p> : ''}
        {!transports.length ? (
          ''
        ) : (
          <div className="firstAnswer">
            <ul>
              <li className="iconLi">MODE</li>
              <li className="textLi">DISTANCE</li>
              <li className="textLi">DURATION</li>
              <li className="textLi">CARBON FOOTPRINT</li>
              <li className="btnLi" />
              <li className="btnLi" />
            </ul>
          </div>
        )}
        {transports
          .sort((m1, m2) => {
            if (m1.carbon > m2.carbon) return 1
            else if (m1.carbon < m2.carbon) return -1
            else {
              if (m1.time > m2.time) return 1
              if (m1.time < m2.time) return -1
            }
          })
          .map((mode, i) =>
            !mode.error ? (
              <div className="answer" key={i}>
                {trip.return === true ? (
                  <ul>
                    <li className="iconLi">{() => displayMode(mode.mode)}</li>
                    <li className="textLi">{mode.distance * 2} km</li>
                    <li className="textLi">{timeConvert(mode.time * 2)}</li>
                    <li className="textLi">{mode.carbon * 2} kg</li>
                    <li className="btnLi">
                      <button
                        className="saveTrip"
                        onClick={() => handlesaveTrip(i)}
                      >
                        {transports.visited ? (
                          <i class="fas fa-bookmark" />
                        ) : (
                          <i className="far fa-bookmark" />
                        )}
                      </button>
                    </li>
                    <li className="btnLi">
                      <button className="addTrip">0</button>
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li className="iconLi">{() => displayMode(mode.mode)}</li>
                    <li className="textLi">{mode.distance} km</li>
                    <li className="textLi">{timeConvert(mode.time)}</li>
                    <li className="textLi">{mode.carbon} kg</li>
                    <li className="btnLi">
                      <button
                        className="saveTrip"
                        onClick={() => handlesaveTrip(i)}
                      >
                        {/* {props.savedTrip.includes(transports[i]) ? ( */}
                        <i className="far fa-bookmark" />
                        {/* ) : (
                          <i class="fas fa-bookmark"></i>
                        )} */}
                      </button>
                    </li>
                    <li className="btnLi">
                      <button className="addTrip">0</button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              ''
            )
          )}
      </div>
    </div>
  )
}
