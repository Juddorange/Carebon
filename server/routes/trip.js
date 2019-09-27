const express = require('express');
const axios = require('axios');
const Trip = require('./../models/Trip');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

function getCarbonPrint(distance, mode) {
	return axios.get(
		`https://api.triptocarbon.xyz/v1/footprint?activity=${distance}&activityType=miles&country=def&mode=${mode}`
	);
}

router.post('/trip', (req, res) => {
	const { distance, mode } = req.body;
	getCarbonPrint(distance, mode).then((carbonPrint) => res.send(carbonPrint)).catch((err) => console.log(err));
});

function getGoogleTrip(origin, destination, mode, transitMode) {
	// return miles
	return axios.get(
		`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&units=imperial&mode=${mode}&transit_mode=${transitMode}&key=${process
			.env.GOOGLE_KEY}`
	);
}

function handleGoogleResponse(req, res) {
	// Infos, needed, MODE, DISTANCE, DUREE

	let transitMode = null;
	let { origin, destination } = req.body;
	let driving = getGoogleTrip(origin, destination, 'driving', transitMode);
	let walking = getGoogleTrip(origin, destination, 'walking', transitMode);
	let training = getGoogleTrip(origin, destination, 'transit', 'train');

	return Promise.all([ driving, walking, training ]);
}

router.post('/google-trip', (req, res, next) => {
	handleGoogleResponse(req, res)
		.then((response) => {
			let anyCar = {
				mode: 'Car',
				distance: Math.floor(response[0].data.routes[0].legs[0].distance.value / 1609.344),
				time: response[0].data.routes[0].legs[0].duration.text,
				carbon: 0
			};
			let foot = {
				mode: 'Walking',
				distance: Math.floor(response[1].data.routes[0].legs[0].distance.value / 1000),
				time: response[1].data.routes[0].legs[0].duration.text,
				carbon: 0
			};
			let transitRail = {
				mode: 'Train',
				distance: Math.floor(response[2].data.routes[0].legs[0].distance.value / 1609.344),
				time: response[2].data.routes[0].legs[0].duration.text,
				carbon: 0
			};

			let railCarbon = getCarbonPrint(transitRail.distance, 'transitRail');
			let carCarbon = getCarbonPrint(anyCar.distance, 'anyCar');
			// let footCarbon = 'not much'
			Promise.all([ railCarbon, carCarbon ]).then((value) => {
				transitRail.carbon = Number(value[0].data.carbonFootprint);
				anyCar.carbon = Number(value[1].data.carbonFootprint);

				transitRail.distance = Math.floor(transitRail.distance * 1609.344 / 1000);
				anyCar.distance = Math.floor(anyCar.distance * 1609.344 / 1000);
				res.send([ transitRail, anyCar, foot ]);
			});
		})
		.catch((err) => console.log(err));
});

//saved trip

router.post('/saved-trip', isLoggedIn, (req, res) => {
	const { departure, arrival, transport, duration, carbon, distance, returnTrip, recurrence } = req.body;
	const newTrip = {
		departure,
		arrival,
		transport,
		duration,
		carbon,
		distance,
		returnTrip,
		recurrence
	};
	newTrip.userId = req.user._id;

	Trip.findOne({
		$and: [
			{ departure: newTrip.departure },
			{ arrival: newTrip.arrival },
			{ transport: newTrip.transport },
			{ returnTrip: newTrip.returnTrip },
			{ userId: req.user._id }
		]
	})
		.then((dbRes) => {
			if (!dbRes) {
				Trip.create(newTrip).then((response) => res.send('SUCCEED!')).catch((err) => console.log(err));
			} else {
				res.json('you already have this trip register');
			}
		})
		.catch((err) => console.log(err));
});

router.get('/saved-trip', (req, res) => {
	Trip.find().then((dbRes) => res.json(dbRes)).catch((err) => console.log(err));
});

module.exports = router;
