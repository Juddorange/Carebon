import api from '../../api'
import React from 'react'

import { withScriptjs } from 'react-google-maps'
import Map from './MyMapComponent'
// import './style.css'

export default function Test() {
  let trip1 = { origin: 'Paris', destination: 'Brest', mode: 'WALKING' }
  let trip2 = { origin: 'Paris', destination: 'Brest', mode: 'TRANSIT' }
  let trip3 = { origin: 'Paris', destination: 'Brest', mode: 'DRIVING' }
  let trips = [trip1, trip2, trip3]

  return (
    <div>
      <button>TEST ME</button>
      <Map trips={trip1} />
    </div>
  )
}
