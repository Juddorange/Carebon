import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import Search from './pages/Search';
import TripDetail from './pages/TripDetail';
import AddCountry from './pages/AddCountry';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Test from './pages/Test';
import api from './../api';

export default function App() {
	//state trip
	const [ trip, setTrip ] = useState({
		origin: '',
		destination: '',
		transports: []
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
			if (!savedTrip.length) return;
			api
				.savedTrips(savedTrip)
				.then((res) => {
					console.log('SAVED TRIP!!!', res);
				})
				.catch((err) => console.log(err));
		},
		[ savedTrip ]
	);

	function handlesaveTrip(i) {
		setSavedTrip([
			...savedTrip,
			{
				origin: trip.origin,
				destination: trip.destination,
				mode: trip.transports[i].mode,
				time: trip.transports[i].time,
				distance: trip.transports[i].distance,
				carbon: trip.transports[i].carbon
			}
		]);
	}

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
							onClick={handlesaveTrip}
						/>
					)}
				/>
				<Route path="/add-country" component={AddCountry} />
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
