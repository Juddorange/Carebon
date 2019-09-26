/*global google*/
import React, { useEffect, useState } from 'react'
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'

export default function Map(props) {
  const [directions, setDirections] = useState([])
  const [directions2, setDirections2] = useState([])
  // const [userTravelMode, setUserTravelMode] = useState()

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService()

    const origin = 'Paris'
    const destination = 'Tourcoing'

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result)
          setDirections(result)
        } else {
          console.error(`error fetching directions ${result}`)
        }
      }
    )
  }, [])

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService()

    const origin = 'Nantes'
    const destination = 'Brest'

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result)
          setDirections2(result)
        } else {
          console.error(`error fetching directions ${result}`)
        }
      }
    )
  }, [])

  const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap
      defaultCenter={{ lat: 48.864716, lng: 2.349014 }}
      defaultZoom={13}
    >
      <DirectionsRenderer directions={directions} />
      <DirectionsRenderer directions={directions2} />
    </GoogleMap>
  ))

  return (
    <div>
      <GoogleMapExample
        containerElement={<div style={{ height: `80vh`, width: '80vw' }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  )
}
