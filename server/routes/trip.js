const express = require('express')
const axios = require('axios')

const router = express.Router()

function getCarbonPrint(distance, mode) {
  return axios
    .get(
      `https://api.triptocarbon.xyz/v1/footprint?activity=${distance}&activityType=miles&country=def&mode=${mode}&key=${process.env.GOOGLE_KEY}`
    )
    .then(res => res.data)
    .catch(err => console.log(err))
}

router.post('/trip/', (req, res) => {
  console.log(req.body)
  const { distance, mode } = req.body
  getCarbonPrint(distance, mode)
    .then(carbonPrint => res.send(carbonPrint))
    .catch(err => console.log(err))
})

function getGoogleTrip(origin, destination, mode, transitMode) {
  return axios.get(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&transit_mode=${transitMode}&key=${process.env.GOOGLE_KEY}`
  )
  // .then(res => {
  //   // console.log('Full REQ', res)
  //   console.log('MODEUUUUU!!!!', mode, res.data.routes[0].legs[0].distance)
  // })
  // console.log('Working ! ', origin, destination, mode, transitMode)
}

router.post('/google-trip', (req, res, next) => {
  // Infos, needed, MODE, DISTANCE, DUREE

  let transitMode = null
  let { origin, destination } = req.body
  let driving = getGoogleTrip(origin, destination, 'driving', transitMode)
  let walking = getGoogleTrip(origin, destination, 'walking', transitMode)
  let training = getGoogleTrip(origin, destination, 'transit', 'train')
  let busing = getGoogleTrip(origin, destination, 'transit', 'bus')
  Promise.all([driving, walking, training, busing])
    .then(res => {
      // console.log('Promoise VALUES :', res)
      // res.forEach()
      let car = {
        distance: res[0].data.routes[0].legs[0].distance,
        time: res[0].data.routes[0].legs[0].duration,
      }
      let foot = {
        distance: res[1].data.routes[0].legs[0].distance,
        time: res[1].data.routes[0].legs[0].duration,
      }
      let train = {
        distance: res[2].data.routes[0].legs[0].distance,
        time: res[2].data.routes[0].legs[0].duration,
      }
      let bus = {
        distance: res[3].data.routes[0].legs[0].distance,
        time: res[3].data.routes[0].legs[0].duration,
      }
      console.log('car :', car)
      console.log('foot :', foot)
      console.log('train :', train)
      console.log('bus :', bus)

      // res.send({ ca })
    })
    .catch(err => console.log(err))
})

module.exports = router
