import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import Search from './pages/Search';
import TripDetail from './pages/TripDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Test from './pages/Test';
import api from './../api';

export default function App() {
	//state trip
	const [ trip, setTrip ] = useState({
		origin: 'Paris',
		destination: 'Lyon',
		transports: [],
		return: 'ONE WAY'
	});

	function handleChange(event) {
		event.preventDefault();
		setTrip({ ...trip, [event.target.name]: event.target.value });
	}

	function handleSubmit(event) {
		event.preventDefault();
		api
			.getEveryAnswer(trip.origin, trip.destination)
			.then((res) => {
				console.log('res', res);
				setTrip({ ...trip, transports: res });
			})
			.catch((err) => console.log(err));
	}

	//state saved user trips
	const [ savedTrip, setSavedTrip ] = useState([]);

	useEffect(
		() => {
			console.log('saved issu du user', savedTrip);
			if (!savedTrip.length) return;
			api
				.savedTrips(savedTrip)
				.then((res) => {
					console.log('is the trip saved?', res);
				})
				.catch((err) => console.log(err));
		},
		[ savedTrip ]
	);

	useEffect(() => {
		api.getSavedTrip().then((res) => setSavedTrip([ ...savedTrip, res ])).catch((err) => console.log(err));
	}, []);

	function handlesaveTrip(i) {
		setSavedTrip([ ...savedTrip ], {
			origin: trip.origin.toUpperCase(),
			destination: trip.destination.toUpperCase(),
			mode: trip.transports[i].mode.toUpperCase(),
			time: trip.transports[i].time.toUpperCase(),
			distance: trip.transports[i].distance,
			carbon: trip.transports[i].carbon,
			return: trip.return,
			recurrence: 1
		});
	}

	function handleAddTrip(i) {}

	return (
		<div className="App">
			<MainNavbar />
			<Switch>
				<Route
					path="/"
					exact
					render={() => (
						<Search
							trip={trip}
							savedTrip={savedTrip}
							onChange={handleChange}
							onSubmit={handleSubmit}
							onClickSave={handlesaveTrip}
							onClickAdd={handleAddTrip}
						/>
					)}
				/>
				<Route path="/:trip-detail" component={TripDetail} />
				<Route path="/signup" component={Signup} />
				<Route path="/login" component={Login} />
				<Route path="/profile" component={Profile} />
				<Route path="/test" component={Test} />
				<Route render={() => <h2>404</h2>} />
			</Switch>
		</div>
	);
}
