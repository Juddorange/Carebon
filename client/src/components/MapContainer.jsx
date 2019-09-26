// import React, { useState } from 'react'
// import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

// const mapStyles = {
//   width: '100%',
//   height: '100%',
// }

// const MapContainer = props => {
//   const [stores, setStores] = useState([
//     { lat: 47.49855629475769, lng: -122.14184416996333 },
//     { latitude: 47.359423, longitude: -122.021071 },
//     { latitude: 47.2052192687988, longitude: -121.988426208496 },
//     { latitude: 47.6307081, longitude: -122.1434325 },
//     { latitude: 47.3084488, longitude: -122.2140121 },
//     { latitude: 47.5524695, longitude: -122.0425407 },
//   ])

//   const displayMarkers = () => {
//     return stores.map((store, index) => {
//       return (
//         <Marker
//           key={index}
//           id={index}
//           position={{
//             lat: store.latitude,
//             lng: store.longitude,
//           }}
//           onClick={() => console.log('You clicked me!')}
//         />
//       )
//     })
//   }

//   console.log(props)
//   return (
//     <>
//       <Map
//         google={props.google}
//         zoom={8}
//         style={mapStyles}
//         initialCenter={{ lat: 47.444, lng: -122.176 }}
//       >
//         {displayMarkers()}
//       </Map>
//     </>
//   )
// }

// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyCWvrqie6LcF4Nry9lYktrQd4uFH_d01Hs',
// })(MapContainer)
