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
    average: [],
    toolTipLabels: [],
    lineLabels: [],
    tripsByMode: { train: 0, car: 0, foot: 0, bicycle: 0 },
    averageCarbonPerMonth: 0,
  })
  const [carbonAvg, setCarbonAvg] = useState(0)

  //update profile
  useEffect(() => {
    api
      .getProfile()
      .then(res => {
        setUser(res)
      })
      .catch(err => console.log(err))
  }, [])

  // update carbon average
  useEffect(() => {
    console.log('it has begun')
    api
      .getCarbonAvg()
      .then(res => {
        let arrLength = res.length
        for (let carbs in res) if (carbs === 0) arrLength -= 1
        let carbAvg =
          Math.floor((res.reduce((acc, cv) => acc + cv, 0) * 100) / arrLength) /
          100
        setCarbonAvg(carbAvg)
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
        api
          .logout()
          .then(res => props.history.push('/signup'))
          .catch(err => console.log(err))
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

  //charts
  function updateAvgProfile(value) {
    api
      .updateProfile('carbonAvg', value)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  function formatStats(arr) {
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
    let carbonEmittedPerTrip = arr.map(v => v.carbon)
    let averageNumber =
      Math.round(
        (carbonEmittedPerTrip.reduce((acc, cv) => acc + cv, 0) /
          carbonEmittedPerTrip.length) *
          100
      ) / 100
    let toolTipLabels = []
    let lineLabels = []
    let average = []

    for (let i = 0; i < arr.length; i++) {
      toolTipLabels.push(
        arr[i].departure + '-' + arr[i].arrival + ' (' + arr[i].transport + ')'
      )
      lineLabels.push(i + 1)
      average.push(averageNumber)
    }

    //Average carbon emitted per Month data
    let totalCarbonPerMonthArray = arr.map(trip => {
      let period = trip.frequency.period
      let number = trip.frequency.number
      let carbon = trip.carbon
      if (period === 'day') number = number * 30
      else if (period === 'week') number = number * 4

      return (carbon = carbon * number)
    })
    let averageCarbonPerMonth =
      Math.round(
        100 * totalCarbonPerMonthArray.reduce((acc, cv) => acc + cv, 0)
      ) / 100

    setStatistics({
      ...statistics,
      carbonEmittedPerTrip,
      average,
      toolTipLabels,
      tripsByMode,
      lineLabels,
      averageCarbonPerMonth,
    })
    updateAvgProfile(averageCarbonPerMonth)
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
        setTrip(res)
        formatStats(res)
      })
      .catch(err => console.log(err))
    /* eslint-disable */
  }, [])

  return (
    <div className="profile">
      <div className="profile_info">
        <h1>PROFILE</h1>
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
          <button className="btn-delete" onClick={handleDelete}>
            Delete account
          </button>
        </div>
      </div>
      <div className="trip-charts">
        <div className="charts">
          <h1 style={{ color: '#f29833' }}>DASHBOARD</h1>
          <div className="line">
            <GraphCarbonOverTime
              title={'CARBON OVER TIME'}
              width={'100%'}
              height={'300px'}
              labels={statistics.lineLabels}
              toolTipLabels={statistics.toolTipLabels}
              data={{
                carbonEmittedPerTrip: statistics.carbonEmittedPerTrip,
                average: statistics.average,
              }}
            />
          </div>{' '}
          <div className="carbon-projects">
            <div className="doughnut">
              <GraphTripsDoughnut
                width={'100%'}
                height={'auto'}
                labels={['train', 'car', 'foot', 'bicycle']}
                data={statistics.tripsByMode}
              />
            </div>
            <div className="stats">
              <h1>STATISTICS</h1>
              <h3 className="statsTitle">
                <strong>{statistics.averageCarbonPerMonth}</strong>
                Your average carbon emission per month in kg{' '}
                <h3 className="statsTitleCommunity">
                  <strong>{carbonAvg}</strong>Our community's monthly average
                  footprint in kg
                </h3>
              </h3>
              <h3 className="statsTitle">
                <strong>
                  {(statistics.averageCarbonPerMonth * (25 / 1000)).toFixed(2)}€
                </strong>{' '}
                Cost to offset your monthly carbon footprint{' '}
              </h3>
            </div>
          </div>
        </div>
        <div className="projects">
          <h1>CARBON OFFSET PROJECTS</h1>
          <p>
            You can offset your carbon footprint by investing into our partners'
            programs!
          </p>
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
        <div className="profile_trips">
          <h1 style={{ textAlign: 'center' }}>YOUR TRIPS</h1>
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
