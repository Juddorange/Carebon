import React, { useState } from 'react';
// import api from '../../api';

export default function Home() {
	const [ trip, setTrip ] = useState({
		origin: '',
		destination: ''
	});

	function handleChange(event) {
		event.preventDefault();
		setTrip({ ...trip, [event.target.name]: event.target.value });
	}

	function handleSubmit(event) {
		event.preventDefault();
		// api;
		// .getTrip(trip.origin, trip.destination)
		// .then((trips) => setTrip({ ...trip, tripMode: trips }))
		// .catch((err) => console.log(err));
	}

	return (
		<div className="Home">
			<h2>Where do you want to go?</h2>
			<form action="" onSubmit={handleSubmit}>
				Departure: <input type="text" name="origin" value={trip.origin} onChange={handleChange} />
				Arrival: <input type="text" name="destination" value={trip.destination} onChange={handleChange} />
				<button>Go!</button>
			</form>
			<pre>{JSON.stringify(trip)}</pre>
			<div className="tripsAnswer">
				<div className="oneAnswer">
					<ul>
						<li>Mode</li>
						<li>Distance</li>
						<li>Duration</li>
						<li>Carbon</li>
					</ul>
					<button>Save this Itinary</button>
				</div>
				{/* {trip.tripMode.map(mode => (
          <div>
            <ul>
              <li>{mode.medium}</li>
              <li>{mode.distance}</li>
              <li>{mode.duration}</li>
              <li>{mode.carbon}</li>
            </ul>
            <button onClick="">Save this Itinary</button>
          </div>
        ))} */}
			</div>
		</div>
	);
}
