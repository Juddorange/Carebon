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
		origin: '',
		destination: '',
		transports: [],
		return: false,
		errorMsg: ''
	});

	function handleChange(event) {
		let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		setTrip({ ...trip, [event.target.name]: value });
	}

	function handleSubmit(event) {
		console.log('trip', trip);
		event.preventDefault();
		Promise.all([ api.getEveryAnswer(trip.origin, trip.destination), api.getSavedTrip() ])
			.then((values) => {
				if (values[0].err) {
					setTrip({ ...trip, errorMsg: values[0].err });
				} else {
					let searchedTrips = values[0];
					let savedTrips = values[1];
					for (let i = 0; i < searchedTrips.length; i++) {
						for (let j = 0; j < savedTrips.length; j++)
							if (
								searchedTrips[i].mode === savedTrips[j].transport &&
								trip.origin === savedTrips[j].departure &&
								trip.destination === savedTrips[j].arrival
							) {
								if (
									(trip.return === true && savedTrips[j].returnTrip === 'RETURN TRIP') ||
									(trip.return === false && savedTrips[j].returnTrip === 'ONE WAY')
								) {
									searchedTrips[i].visited = true;
								}
							}
					}
					console.log('searchtrips', searchedTrips);
					setTrip({ ...trip, errorMsg: '', transports: searchedTrips });
					setSavedTrip(savedTrips);
				}
			})
			.catch((err) => console.log(err));
	}

	//state saved user trips
	const [ savedTrip, setSavedTrip ] = useState([]);

	useEffect(
		() => {
			if (!savedTrip.length) return;
			console.log(savedTrip);
			api.savedTrips(savedTrip).then((res) => {}).catch((err) => console.log(err));
		},
		[ savedTrip ]
	);

	useEffect(() => {
		if (!api.isLoggedIn()) return;
		api
			.getSavedTrip()
			.then((res) => {
				setSavedTrip(res);
			})
			.catch((err) => console.log(err));
	}, []);

	function handlesaveTrip(i) {
		if (!api.isLoggedIn()) return;
		else {
			setSavedTrip([
				...savedTrip,
				{
					origin: trip.origin.toUpperCase(),
					destination: trip.destination.toUpperCase(),
					mode: trip.transports[i].mode.toUpperCase(),
					time: trip.transports[i].time,
					distance: trip.transports[i].distance,
					carbon: trip.transports[i].carbon,
					return: trip.return,
					recurrence: 1
				}
			]);
		}
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
