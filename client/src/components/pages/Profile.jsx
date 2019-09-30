import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import api from '../../api'
import LineCarbonGraph from './LineCarbonGraph'
import TripsDoughnut from './TripsDoughnut'

export default function Profile() {
  //edit profile
  const [user, setUser] = useState({
    email: '',
    name: '',
    picture: '',
  })

  useEffect(() => {
    api
      .getProfile()
      .then(res => {
        console.log(res)
        setUser(res)
      })
      .catch(err => console.log(err))
  }, [])

  function handleOnChange(e) {
    e.preventDefault()
    let value = e.target.value
    if (e.target.name === 'picture') {
      console.log(e.target.files)
      setUser({
        ...user,
        pictureToUpdate: e.target.files[0],
      })
    } else setUser({ ...user, [e.target.name]: value })
  }

  function handleClickButton(e) {
    e.preventDefault()
    let name = e.target.previousSibling.getAttribute('name')
    if (name === 'name') {
      api
        .updateProfile('name', user.name)
        .then(res => setUser(...user, user.name))
        .catch(err => console.log(err))
    }
    if (name === 'email') {
      api
        .updateProfile('email', user.email)
        .then(res => setUser(...user, user.email))
        .catch(err => console.log(err))
    }
    if (name === 'picture') {
      api
        .updatePicture(user.pictureToUpdate)
        .then(res => setUser(res))
        .catch(err => console.log(err))
    }
  }

  //saved trips

  const [trip, setTrip] = useState([])
  useEffect(() => {
    api
      .getSavedTrip()
      .then(res => setTrip(res))
      .catch(err => console.log(err))
  }, [])

  const [percentage, setpercentage] = useState(1)
  const [data, setData] = useState([])

  useEffect(() => {
    setpercentage(80)

    setData({
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    })
  }, [setpercentage, setData])

      .then(res => {
        console.log(res)
        setTrip(res)
      })
      .catch(err => console.log(err))
  }, [])

  //fake saved trips coz not working
  const tripette1 = {
    departure: 'Paris',
    arrival: 'Brest',
    transport: 'train',
    duration: '4 hours 54 mins',
    carbon: 64.22,
    distance: 394,
    returnTrip: 'ONE WAY',
    recurrence: 2,
  }
  const tripette2 = {
    departure: 'Paris',
    arrival: 'Lyon',
    transport: 'car',
    duration: '4 hours 54 mins',
    carbon: 130.25,
    distance: 502,
    returnTrip: 'ONE WAY',
    recurrence: 1,
  }
  const tripette3 = {
    departure: 'Paris',
    arrival: 'Lyon',
    transport: 'car',
    duration: '4 hours 54 mins',
    carbon: 1300,
    distance: 502,
    returnTrip: 'ONE WAY',
    recurrence: 1,
  }

  const tripettes = [tripette1, tripette2, tripette3]

  let datounes = []
  let carbon = 0
  for (let data of tripettes) {
    carbon += data.carbon
    datounes.push(carbon)
  }

  tripettes.map(trip => trip.carbon)
  let labelounes = []
  for (let i = 1; i <= tripettes.length; i++) {
    labelounes.push(i)
  }
  return (
    <div className="profile">
      <div className="profile_info">
        <h1>Profile</h1>
        <br />
        <div className="profil_image">
          <img style={{ height: '300px' }} src={user.picture} alt="img" />
        </div>
        <div>
          <label>Name : </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleOnChange}
          />
          <button onClick={handleClickButton} className="edit-btn">
            Edit
          </button>
          <br />
          <label>Email : </label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleOnChange}
          />
          <button onClick={handleClickButton} className="edit-btn">
            Edit
          </button>
          <br />
          {/* <label>Password : </label>
				<input type="password" name="password" value={user.password} onChange={handleOnChange} />
				<button onClick={handleClickButton} className="edit-btn">
					Edit
				</button>
				<br /> */}
          <label>Profile picture : </label>
          <input type="file" name="picture" onChange={handleOnChange} />
          <button onClick={handleClickButton} className="edit-btn">
            Edit
          </button>
          <br />
        </div>
        <button>Delete account</button>
      </div>
      <div className="profile_trips">
        <h1>Your trips</h1>
        {trip.map((trips, i) => (
          <ul key={i}>
            <h2>Trip n° {[i + 1]}</h2>
            {/* <h2>Trip n° {[i]}</h2> */}
            <li>Departure: {trips.departure}</li>
            <li>Arrival: {trips.arrival}</li>
            <li>Transport: {trips.transport}</li>
            <li>Duration: {trips.duration}</li>
            <li>Cabron footprint: {trips.carbon} kg</li>
          </ul>
        ))}
      </div>
      <LineCarbonGraph
        width={'50vw'}
        height={'50vh'}
        options={{ maintainAspectRatio: false, responsive: true }}
        labels={labelounes}
        data={datounes}
      />
      <TripsDoughnut
        width={'50vw'}
        height={'50vh'}
        options={{ maintainAspectRatio: false, responsive: true }}
        labels={labelounes}
        data={datounes}
      />
    </div>
  )
}
