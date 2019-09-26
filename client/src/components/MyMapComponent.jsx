// import React, { useState } from 'react'
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
// } from 'react-google-maps'

// export default function MyMapComponent(props) {
//   const [state, setState] = useState({ directions: null })

//   function componentDidMount() {
//     const directionsService = new google.maps.DirectionService()

//     const origin = { lat: 40.756795, lng: -73.954298 }
//     const destination = { lat: 41.756795, lng: -78.954298 }

//     directionsService.route(
//       {
//         origin: origin,
//         destination: destination,
//         travelMode: google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === google.maps.DirectionsStatus.OK) {
//           setState({
//             directions: result,
//           })
//         } else {
//           console.error(`error fetching directions ${result}`)
//         }
//       }
//     )
//   }

//   const GoogleMapExample = withGoogleMap(props => (
//     <GoogleMap
//       defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
//       defaultZoom={13}
//     >
//       <DirectionsRenderer directions={this.state.directions} />
//     </GoogleMap>
//   ))

//   return (
//     <div>
//       <GoogleMapExample
//         containerElement={<div style={{ height: `500px`, width: '500px' }} />}
//         mapElement={<div style={{ height: `100%` }} />}
//       />
//     </div>
//   )
// }
