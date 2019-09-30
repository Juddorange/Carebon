import React from 'react';

export default function Search(props) {
	let transports = props.trip.transports;
	function timeConvert(n) {
		var num = n;
		var hours = num / 60;
		var rhours = Math.floor(hours);
		var minutes = (hours - rhours) * 60;
		var rminutes = Math.round(minutes);
		return rhours > 0 ? rhours + ' h ' + rminutes + ' min' : rminutes + ' min';
	}
	return (
		<div className="Home">
			<h2>TRACK A JOURNEY</h2>
			<p>{props.trip.errorMsg}</p>
			<form action="" onSubmit={props.onSubmit} className="searchForm">
				<input
					className="searchInput"
					type="text"
					name="origin"
					value={props.trip.origin}
					onChange={props.onChange}
					placeholder="Departure"
				/>
				<input
					className="searchInput"
					type="text"
					name="destination"
					value={props.trip.destination}
					onChange={props.onChange}
					placeholder="Destination"
				/>
				<select
					name="return"
					value={props.trip.return}
					id="return"
					onChange={props.onChange}
					required
					className="selectInput"
				>
					<option value="">Type of trip</option>
					<option value="ONE WAY">One Way</option>
					<option value="RETURN TRIP">Return Trip</option>
				</select>
				<button className="searchBtn">GO</button>
			</form>
			<div className="tripsAnswer">
				{transports
					.sort((m1, m2) => {
						if (m1.carbon > m2.carbon) return 1;
						else if (m1.carbon < m2.carbon) return -1;
						else {
							if (m1.time > m2.time) return 1;
							if (m1.time < m2.time) return -1;
						}
					})
					.map(
						(mode, i) =>
							!mode.error ? (
								<div className="answer" key={i}>
									{props.trip.return === 'RETURN TRIP' ? (
										<ul>
											<li>
												{(mode.mode === 'Car' && <i class="fas fa-car" />) ||
													(mode.mode === 'Train' && <i class="fas fa-train" />) ||
													(mode.mode === 'Bicycle' && <i class="fas fa-biking" />) ||
													(mode.mode === 'Walking' && <i class="fas fa-walking" />)}
											</li>
											<li>{mode.distance * 2} km</li>
											<li>{timeConvert(mode.time * 2)}</li>
											<li>Carbon footprint: {mode.carbon * 2} kg</li>
											<li>
												<button className="saveTrip" onClick={() => props.onClickSave(i)}>
													<i class="far fa-bookmark" />
												</button>
											</li>
											<li>
												<button className="addTrip">Add</button>
											</li>
										</ul>
									) : (
										<ul>
											<li>
												{(mode.mode === 'Car' && <i class="fas fa-car" />) ||
													(mode.mode === 'Train' && <i class="fas fa-train" />) ||
													(mode.mode === 'Bicycle' && <i class="fas fa-biking" />) ||
													(mode.mode === 'Walking' && <i class="fas fa-walking" />)}
											</li>
											<li>{mode.distance} km</li>
											<li>{timeConvert(mode.time)}</li>
											<li>Carbon footprint: {mode.carbon} kg</li>
											<li>
												<button className="saveTrip" onClick={() => props.onClickSave(i)}>
													<i class="far fa-bookmark" />
												</button>
											</li>
											<li>
												<button className="addTrip">0</button>
											</li>
										</ul>
									)}
								</div>
							) : (
								''
							)
					)}
			</div>
		</div>
	);
}
