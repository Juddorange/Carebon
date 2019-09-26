import api from '../../api'
import React from 'react'

import { withScriptjs } from 'react-google-maps'
import Map from './MyMapComponent'
// import './style.css'

export default function Test() {
  let a = 'Paris'
  let b = 'Lyon'
  function handleClick() {
    api.getEveryAnswer(a, b)
  }

  const MapLoader = withScriptjs(Map)

  return (
    <div>
      <button onClick={handleClick}>TEST ME</button>
      <MapLoader
        origin="Paris"
        destination="Tourcoing"
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
      />
    </div>
  )
}
