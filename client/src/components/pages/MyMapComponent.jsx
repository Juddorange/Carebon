import React, { useState, useEffect } from 'react'
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  DirectionsRenderer,
} from 'react-google-maps'
import _ from 'lodash'

const Map = React.memo(props => {
  const mapMe = arr => {
    return arr.map(a => a.lat_lngs[0])
  }

  // console.log(props.directions.routes[0].legs[0].steps)
  console.log(props.directions)
  useEffect(() => {
    const DirectionsService = new window.google.maps.DirectionsService()
    DirectionsService.route(
      {
        origin: props.trips.origin,
        destination: props.trips.destination,
        travelMode: window.google.maps.TravelMode[props.trips.mode],
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          props.handleDirections(result)
        } else {
          console.error(`error fetching directions ${JSON.stringify(result)}`)
        }
      }
    )
  }, [props.markers])

  const polyOptions = {
    strokeColor: 'red',
    strokeOpacity: 0.5,
    zIndex: 1,
    strokeWeight: 5,
  }
  function handleMe(e) {
    console.log(e, 'this is meee')
  }

  return (
    <GoogleMap
      onClick={props.handleMapClicked}
      ref={props.onMapMounted}
      defaultZoom={12}
      center={props.center}
      defaultCenter={{ lat: 48.866667, lng: 2.333333 }}
    >
      {props.directions && (
        <Polyline
          onClick={handleMe}
          options={polyOptions}
          path={props.directions.routes[0].overview_path}
        />
      )}
      <DirectionsRenderer directions={props.directions} />
    </GoogleMap>
  )
})

const WrapperMap = withScriptjs(withGoogleMap(Map))

const AppMap = props => {
  const [state, setState] = useState({})
  const refs = {}

  useEffect(() => {
    setState({
      ...state,
      bounds: null,
      center: {
        lat: 48.866667,
        lng: 2.333333,
      },
      markers: [],
    })
    /* eslint-disable */
  }, [])

  const onMapMounted = ref => (refs.map = ref)
  // const onBoundsChanged = () => {
  //   setState({
  //     ...state,
  //     bounds: refs.map.getBounds(),
  //     center: refs.map.getCenter(),
  //   })
  // }

  const onPlacesChanged = () => {
    const places = refs.searchBox.getPlaces()
    const bounds = new window.google.maps.LatLngBounds()
    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    const nextMarkers = places.map(place => ({
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    }))

    const nextCenter = _.get(nextMarkers, '0.position', state.center)
    setState({
      ...state,
      center: nextCenter,
      markers: [...state.markers, ...nextMarkers],
    })
  }

  const handleDirections = result => {
    setState({ ...state, directions: result })
  }
  const handleMarkerClick = props => {
    console.log(props)
    console.log(props.latLng.lat())
    console.log(props.latLng.lng())
  }
  const handleMapClicked = e => {
    setState({
      ...state,
      markers: [
        ...state.markers,
        { position: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
      ],
    })
  }
  return (
    <div style={{ height: '50vh' }}>
      <WrapperMap
        trips={props.trips}
        handleMapClicked={handleMapClicked}
        handleMarkerClick={handleMarkerClick}
        directions={state.directions}
        center={state.center}
        onMapMounted={onMapMounted}
        markers={state.markers}
        onPlacesChanged={onPlacesChanged}
        handleDirections={handleDirections}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_APIKEY}`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  )
}

export default AppMap
