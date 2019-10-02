import React, { useState, useEffect } from 'react'

import api from '../../api'
import GraphCarbonOverTime from './GraphCarbonOverTime'
import GraphTripsDoughnut from './GraphTripsDoughnut'

export default function Profile(props) {
  //edit profile
  const [user, setUser] = useState({
    email: '',
    name: '',
    picture: '',
    msg: '',
  })

  const [UIMessage, setUIMessage] = useState('')

  //saved trips

  const [trip, setTrip] = useState([])
  const [statistics, setStatistics] = useState({
    carbonEmittedPerTrip: [],
    // average: [],
    lineLabels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tripsByMode: { train: 0, car: 0, foot: 0, bicycle: 0 },
    averageCarbonPerMonth: 0,
    carbonYearArray: [],
  })

  //update profile
  useEffect(() => {
    api
      .getProfile()
      .then(res => {
        setUser(res)
      })
      .catch(err => console.log(err))
  }, [])

  function handleOnChange(e) {
    e.preventDefault()
    let value = e.target.value
    if (e.target.name === 'picture') {
      setUser({
        ...user,
        pictureToUpdate: e.target.files[0],
      })
    } else setUser({ ...user, [e.target.name]: value })
  }

  function handleClickButton(e) {
    e.preventDefault()
    // e.target.parentElement.previousSibling.getAttribute('name')
    let name = e.target.parentElement.parentElement.childNodes[1].getAttribute(
      'name'
    )
    if (name === 'name') {
      api
        .updateProfile('name', user.name)
        .then(res => {
          setUIMessage(res.msg)
          setUser({ ...user, name: user.name })
        })
        .catch(err => console.log(err))
    }
    if (name === 'email') {
      api
        .updateProfile('email', user.email)
        .then(res => {
          setUIMessage(res.msg)
          setUser({ ...user, email: user.email })
        })
        .catch(err => console.log(err))
    }
    if (name === 'picture') {
      api
        .updatePicture(user.pictureToUpdate)
        .then(res => {
          setUser({ ...user, picture: res.dbRes.picture })
          setUIMessage(res.msg)
        })
        .catch(err => console.log(err))
    }
  }

  //delete profile
  function handleDelete() {
    api
      .deleteProfile()
      .then(res => {
        props.history.push('/signup')
      })
      .catch(err => console.log(err))
  }

  //delete trip
  function deleteTrip(_id) {
    api
      .deleteTrip(_id)
      .then(res => {
        api
          .getSavedTrip()
          .then(res => {
            setTrip(res)
            formatStats(res)
          })
          .catch(err => console.log(err))
        /* eslint-disable */
      })
      .catch(err => console.log(err))
  }

  // Stacked year emission
  function yearStack(monthlyEmission) {
    let carbonArray = [0]
    let stock = 0
    for (let i = 0; i < 12; i++) {
      stock += monthlyEmission
      carbonArray.push(Math.floor(stock))
    }
    return carbonArray
  }

  //WIP
  function getTimePassedInHours(date) {
    var date = new Date(date).toUTCString()
    var now = new Date().toUTCString()
    return (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  }

  //charts
  function formatStats(arr) {
    // console.log('DATASET', arr)
    console.log('NOW', new Date())
    console.log('NOW TO UTC', new Date().toUTCString())
    console.log('JUST DATE', new Date(arr[0].created_at))
    console.log('TO UTC', new Date(arr[0].created_at).toUTCString())

    //Pie chart data
    let bicycleTravels = 0,
      trainTravels = 0,
      carTravels = 0,
      footTravels = 0

    for (let element of arr) {
      if (element.transport === 'BICYCLE') bicycleTravels += 1
      else if (element.transport === 'CAR') carTravels += 1
      else if (element.transport === 'TRAIN') trainTravels += 1
      else footTravels += 1
    }
    let tripsByMode = {
      train: trainTravels,
      car: carTravels,
      foot: footTravels,
      bicycle: bicycleTravels,
    }

    //Line chart data
    // let carbonEmittedPerTrip = arr.map(v => v.carbon)
    // let averageNumber =
    //   Math.round(
    //     (carbonEmittedPerTrip.reduce((acc, cv) => acc + cv, 0) /
    //       carbonEmittedPerTrip.length) *
    //       100
    //   ) / 100
    // let lineLabels = []
    // let average = []
    // for (let i = 1; i < arr.length + 1; i++) {
    //   lineLabels.push(i)
    //   average.push(averageNumber)
    // }

    //Average carbon emitted per Month data
    let totalCarbonPerMonthArray = arr.map(trip => {
      let period = trip.frequency.period
      let number = trip.frequency.number
      let carbon = trip.carbon
      if (period === 'day') number = number * 30
      else if (period === 'week') number = number * 4

      return (carbon = carbon * number)
    })
    console.log('totalCarbonPerMonthArray', totalCarbonPerMonthArray)
    let averageCarbonPerMonth =
      Math.round(
        100 * totalCarbonPerMonthArray.reduce((acc, cv) => acc + cv, 0)
      ) / 100
    console.log(averageCarbonPerMonth)
    let carbonYearArray = yearStack(averageCarbonPerMonth)
    console.log('carbonYearArray', carbonYearArray)

    setStatistics({
      ...statistics,
      // carbonEmittedPerTrip,
      // average,
      // lineLabels,
      tripsByMode,
      averageCarbonPerMonth,
      carbonYearArray,
    })
  }

  //display transport mode
  function displayMode(mode) {
    if (mode === 'CAR') return 'fas fa-car'
    else if (mode === 'TRAIN') return 'fas fa-train'
    else if (mode === 'BICYCLE') return 'fas fa-biking'
    else return 'fas fa-walking'
  }

  useEffect(() => {
    api
      .getSavedTrip()
      .then(res => {
        console.log(res)
        setTrip(res)
        formatStats(res)
      })
      .catch(err => console.log(err))
    /* eslint-disable */
  }, [])

  return (
    <div className="profile">
      <div className="profile_info">
        <h1>Profile</h1>
        <br />
        <div className="profile_image">
          <img style={{ width: '100%' }} src={user.picture} alt="img" />
        </div>
        <div>
          {UIMessage && (
            <p className="msg-edit">
              <strong>{UIMessage}</strong>
            </p>
          )}
        </div>
        <div className="profile_detail_info">
          <div className="edit_items">
            <label>
              <strong>Name </strong>
            </label>
            <input
              className="input_profile"
              type="text"
              name="name"
              value={user.name}
              onChange={handleOnChange}
            />
            <button onClick={handleClickButton} className="edit-btn">
              <i className="fas fa-pencil-alt" />
            </button>
          </div>
          <div className="edit_items">
            <label>
              <strong>Email</strong>
            </label>
            <input
              className="input_profile"
              type="text"
              name="email"
              value={user.email}
              onChange={handleOnChange}
            />
            <button onClick={handleClickButton} className="edit-btn">
              <i className="fas fa-pencil-alt" />
            </button>
          </div>
          <div className="edit_items">
            <label>
              <strong>Profile picture</strong>
              <br />
            </label>
            <input
              className="input_profile"
              type="file"
              name="picture"
              onChange={handleOnChange}
            />{' '}
            <button onClick={handleClickButton} className="edit-btn">
              <i className="fas fa-pencil-alt" />
            </button>
          </div>
        </div>
        <button className="btn-delete" onClick={handleDelete}>
          Delete account
        </button>
      </div>
      <div className="trip-charts">
        <div className="charts">
          <div className="line">
            <h2>
              Average carbon emission per month{' '}
              {statistics.averageCarbonPerMonth} kgs
            </h2>
            <GraphCarbonOverTime
              title={'Carbon over a year'}
              max-width={'30vw'}
              height={'30vh'}
              labels={statistics.lineLabels}
              data={{
                // carbonEmittedPerTrip: statistics.carbonEmittedPerTrip,
                // average: statistics.average,
                carbonYearArray: statistics.carbonYearArray,
              }}
            />
          </div>{' '}
          <div className="line">
            <h2>
              Average carbon emission per month{' '}
              {statistics.averageCarbonPerMonth} kgs
            </h2>
            <GraphCarbonOverTime
              title={'Carbon over time'}
              max-width={'30vw'}
              height={'30vh'}
              labels={statistics.lineLabels}
              data={{
                // carbonEmittedPerTrip: statistics.carbonEmittedPerTrip,
                // average: statistics.average,
                carbonYearArray: statistics.carbonYearArray,
              }}
            />
          </div>{' '}
          <div className="carbon-projects">
            <div className="doughnut">
              <GraphTripsDoughnut
                width={'50vw'}
                height={'50vh'}
                labels={['train', 'car', 'foot', 'bicycle']}
                data={statistics.tripsByMode}
              />
            </div>
            <div className="projects">
              <h2>Carbon offset projects</h2>
              <a
                href="https://offset.climateneutralnow.org/allprojects"
                target="_blank"
                rel="noopener noreferrer"
              >
                United Nations
              </a>
              <a
                href="https://www.climatepartner.com/en/carbon-offset-projects"
                target="_blank"
                rel="noopener noreferrer"
              >
                Climate Partner
              </a>
              <a
                href="https://www.carbonfootprint.com/carbonoffsetprojects.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Carbon Footprint
              </a>
              <a
                href="https://www.goldstandard.org/take-action/offset-your-emissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gold Standard
              </a>
              <a
                href="https://eco-act.com/our-projects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ecoact
              </a>
              <a
                href="https://climatecare.org/project-map/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Climate Care
              </a>
            </div>
          </div>
        </div>
        <div className="profile_trips">
          <h1 style={{ textAlign: 'center' }}>Your trips</h1>
          <div className="trip_details">
            {trip
              .sort((t1, t2) => {
                if (t1.timestamps > t2.timestamps) return 1
                return -1
              })
              .map((trips, i) => (
                <div className="div-ul" key={i}>
                  <h2>
                    <i className={displayMode(trips.transport)} />
                    {'  '}
                    {trips.departure}{' '}
                    {trips.returnTrip === 'ONE WAY' ? (
                      <i className="fas fa-long-arrow-alt-right" />
                    ) : (
                      <i className="fas fa-arrows-alt-h" />
                    )}{' '}
                    {trips.arrival}
                  </h2>
                  <ul>
                    <li>
                      <strong className="title_detail">Duration : </strong>
                      {trips.duration}
                    </li>
                    <li>
                      <strong className="title_detail">Distance : </strong>
                      {trips.distance} km
                    </li>
                    <li>
                      <strong className="title_detail">
                        Carbon footprint :{' '}
                      </strong>
                      {trips.carbon} kg
                    </li>
                    <li>
                      <strong className="title_detail">
                        Recurrence of your trip :{' '}
                      </strong>
                      {trips.frequency.number} / {trips.frequency.period}
                    </li>
                  </ul>
                  <button
                    className="btn-delete"
                    onClick={() => deleteTrip(trips._id)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
