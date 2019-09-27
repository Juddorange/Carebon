import React, { useState, useEffect } from 'react'
import api from '../../api'

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
            <li>Departure: {trips.departure}</li>
            <li>Arrival: {trips.arrival}</li>
            <li>Transport: {trips.transport}</li>
            <li>Duration: {trips.duration}</li>
            <li>Distance: {trips.distance} km</li>
            <li>Cabron footprint: {trips.carbon} kg</li>
          </ul>
        ))}
      </div>
    </div>
  )
}
