const express = require('express')
const axios = require('axios')
const Trip = require('./../models/Trip')
const { isLoggedIn } = require('../middlewares')

const router = express.Router()

function getCarbonPrint(distance, mode) {
  return axios.get(
    `https://api.triptocarbon.xyz/v1/footprint?activity=${distance}&activityType=miles&country=def&mode=${mode}`
  )
}

router.post('/trip', (req, res) => {
  const { distance, mode } = req.body
  getCarbonPrint(distance, mode)
    .then(carbonPrint => res.send(carbonPrint))
    .catch(err => console.log(err))
})

function getGoogleTrip(origin, destination, mode, transitMode) {
  // return miles
  return axios.get(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&units=imperial&mode=${mode}&transit_mode=${transitMode}&key=${process.env.GOOGLE_KEY}`
  )
}

function handleGoogleResponse(req, res) {
  // Infos needed, MODE, DISTANCE, DUREE

  let transitMode = null
  let { origin, destination } = req.body
  let driving = getGoogleTrip(origin, destination, 'driving', transitMode)
  let walking = getGoogleTrip(origin, destination, 'walking', transitMode)
  let training = getGoogleTrip(origin, destination, 'transit', 'train')
  let cycling = getGoogleTrip(origin, destination, 'bicycling', transitMode)

  return Promise.all([driving, walking, training, cycling])
}

router.post('/google-trip', (req, res, next) => {
  handleGoogleResponse(req, res)
    .then(response => {
      // set up objects for each transport mode
      let anyCar =
        response[0].data.routes.length > 0
          ? {
              mode: 'Car',
              distance: Math.floor(
                response[0].data.routes[0].legs[0].distance.value / 1609.344
              ),
              time: response[0].data.routes[0].legs[0].duration.text,
              carbon: 0,
              tag: 'anyCar',
            }
          : { error: 'No route found' }
      let walking =
        response[1].data.routes.length > 0
          ? {
              mode: 'Walking',
              distance: Math.floor(
                response[1].data.routes[0].legs[0].distance.value / 1000
              ),
              time: response[1].data.routes[0].legs[0].duration.text,
              carbon: 0,
              tag: 'walking',
            }
          : { error: 'No route found' }
      let transitRail =
        response[2].data.routes.length > 0
          ? {
              mode: 'Train',
              distance: Math.floor(
                response[2].data.routes[0].legs[0].distance.value / 1609.344
              ),
              time: response[2].data.routes[0].legs[0].duration.text,
              carbon: 0,
              tag: 'transitRail',
            }
          : { error: 'No route found' }
      let bicycle =
        response[3].data.routes.length > 0
          ? {
              mode: 'Bicycle',
              distance: Math.floor(
                response[3].data.routes[0].legs[0].distance.value / 1000
              ),
              time: response[3].data.routes[0].legs[0].duration.text,
              carbon: 0,
              tag: 'bicycle',
            }
          : { error: 'No route found' }

      //wrap the object inside an array that will be passed as response
      let responseArray = [anyCar, walking, transitRail, bicycle]

      // set up the seconde api call inside an array for Promise.All
      let promiseArray = []
      let railCarbon = getCarbonPrint(transitRail.distance, 'transitRail')
      let carCarbon = getCarbonPrint(anyCar.distance, 'anyCar')

      // check that the modes got a valid answer from previous api call
      if (!anyCar.error) {
        promiseArray.push(carCarbon)
      }
      if (!transitRail.error) {
        promiseArray.push(railCarbon)
      }

      if (promiseArray.length > 0) {
        Promise.all(promiseArray).then(values => {
          console.log('values', values)
          values.map(value => {
            for (element of responseArray) {
              console.log('req path', value.request.path)
              console.log('element tag', element.tag)
              if (value.request.path.includes(element.tag)) {
                element.carbon = Number(value.data.carbonFootprint)
                console.log('Element with added carbon', element)
              }
            }
            console.log('<-------Next VALUE------>')
          })
          console.log('Sent data', responseArray)

          res.send(responseArray)
        })
      } else res.json({ err: 'no trip found' })
    })
    .catch(err => console.log(err))
})

//saved trip

router.post('/saved-trip', isLoggedIn, (req, res) => {
  const { departure, arrival, transport, duration, carbon, distance } = req.body
  const newTrip = {
    departure,
    arrival,
    transport,
    duration,
    carbon,
    distance,
  }
  newTrip.userId = req.user._id

  Trip.create(newTrip)
    .then(response => res.send('SUCCEED!'))
    .catch(err => console.log(err))
})

module.exports = router
