/*global google*/
import React, { useEffect, useState } from 'react'
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'

export default function Map(props) {
  console.log(props)

  const [directions, setDirections] = useState([])
  // const [directions2, setDirections2] = useState([])

  // const [userTravelMode, setUserTravelMode] = useState()

  // function setNewDirectionsService(object) {
  //   const directionsService = new window.google.maps.DirectionsService()
  //   let travelModo = window.google.maps.TravelMode

  //   directionsService.route(
  //     {
  //       origin: object.origin,
  //       destination: object.destination,
  // travelMode:
  //   object.mode === 'DRIVING'
  //     ? travelModo.DRIVING
  //     : object.mode === 'TRANSIT'
  //     ? travelModo.TRANSIT
  //     : object.mode === 'WALKING'
  //     ? travelModo.WALKING
  //     : travelModo.BICYCLE,
  //     },
  //     (result, status) => {
  //       if (status === window.google.maps.DirectionsStatus.OK) {
  //         console.log(result)
  //         setDirections(result)
  //       } else {
  //         console.error(`error fetching directions ${result}`)
  //       }
  //     }
  //   )
  // }

  // useEffect(() => {
  //   for (let i = 1; i <= props.trips.length; i++) {
  //     setNewDirectionsService()
  //   }
  // }, [])

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService()

    let travelModo = window.google.maps.TravelMode

    directionsService.route(
      {
        origin: props.trip.origin,
        destination: props.trip.destination,
        travelMode:
          props.trip.mode === 'DRIVING'
            ? travelModo.DRIVING
            : props.trip.mode === 'TRANSIT'
            ? travelModo.TRANSIT
            : props.trip.mode === 'WALKING'
            ? travelModo.WALKING
            : travelModo.BICYCLE,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log(result)
          setDirections(result)
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
      {<DirectionsRenderer directions={directions} />}
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
