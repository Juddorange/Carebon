const express = require('express')
const axios = require('axios')

const router = express.Router()

function getCarbonPrint(distance, mode) {
  return axios.get(
    `https://api.triptocarbon.xyz/v1/footprint?activity=${distance}&activityType=miles&country=def&mode=${mode}`
  )
  //  ; .then(res => {
  //   console.log(res.data)
  //   res.data.carbonFootprint
  // })
  // .catch(err => console.log(err))
}

router.post('/trip', (req, res) => {
  console.log(req.body)
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
  // Infos, needed, MODE, DISTANCE, DUREE

  let transitMode = null
  let { origin, destination } = req.body
  let driving = getGoogleTrip(origin, destination, 'driving', transitMode)
  let walking = getGoogleTrip(origin, destination, 'walking', transitMode)
  let training = getGoogleTrip(origin, destination, 'transit', 'train')

  return Promise.all([driving, walking, training])
}

router.post('/google-trip', (req, res, next) => {
  handleGoogleResponse(req, res)
    .then(response => {
      let anyCar = {
        distance: Math.floor(
          response[2].data.routes[0].legs[0].distance.value / 1609.344
        ),
        time: response[0].data.routes[0].legs[0].duration,
      }
      let foot = {
        distance: response[1].data.routes[0].legs[0].distance.value,
        time: response[1].data.routes[0].legs[0].duration,
      }
      let transitRail = {
        distance: Math.floor(
          response[2].data.routes[0].legs[0].distance.value / 1609.344
        ),
        time: response[2].data.routes[0].legs[0].duration,
      }

      let railCarbon = getCarbonPrint(transitRail.distance, 'transitRail')
      let carCarbon = getCarbonPrint(anyCar.distance, 'anyCar')
      let footCarbon = 'not much'
      console.log('RailCarbon', railCarbon)
      Promise.all([railCarbon, carCarbon]).then(value => {
        console.log(value)
        let railCarbon = value[0].data.carbonFootprint
        let carCarbon = value[1].data.carbonFootprint
        res.send({ railCarbon, carCarbon, footCarbon })
      })
    })
    .catch(err => console.log(err))
})

module.exports = router
