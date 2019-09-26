const express = require('express')
const axios = require('axios')

const router = express.Router()

function getCarbonPrint(distance, mode) {
  return axios
    .get(
      `https://api.triptocarbon.xyz/v1/footprint?activity=${distance}&activityType=miles&country=def&mode=${mode}`
    )
    .then(res => res.data)
    .catch(err => console.log(err))
}

router.post('/', (req, res) => {
  console.log(req.body)
  const { distance, mode } = req.body
  getCarbonPrint(distance, mode)
    .then(carbonPrint => res.send(carbonPrint))
    .catch(err => console.log(err))
})

module.exports = router
