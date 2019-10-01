import React, { useState, useEffect } from 'react';

import api from '../../api';
import CarbonOverTime from './CarbonOverTime';
import TripsDoughnut from './TripsDoughnut';

export default function Profile(props) {
	//edit profile
	const [ user, setUser ] = useState({
		email: '',
		name: '',
		picture: ''
	});
	//saved trips

	const [ trip, setTrip ] = useState([]);
	const [ statistics, setStatistics ] = useState({
		each: [],
		average: [],
		labels: []
	});

	useEffect(() => {
		api
			.getProfile()
			.then((res) => {
				console.log(res);
				setUser(res);
			})
			.catch((err) => console.log(err));
	}, []);

	function handleOnChange(e) {
		e.preventDefault();
		let value = e.target.value;
		if (e.target.name === 'picture') {
			console.log(e.target.files);
			setUser({
				...user,
				pictureToUpdate: e.target.files[0]
			});
		} else setUser({ ...user, [e.target.name]: value });
	}

	function handleClickButton(e) {
		e.preventDefault();
		// e.target.parentElement.previousSibling.getAttribute('name')
		let name = e.target.parentElement.parentElement.childNodes[1].getAttribute('name');
		if (name === 'name') {
			api
				.updateProfile('name', user.name)
				.then((res) => setUser({ ...user, name: user.name }))
				.catch((err) => console.log(err));
		}
		if (name === 'email') {
			api
				.updateProfile('email', user.email)
				.then((res) => setUser({ ...user, email: user.email }))
				.catch((err) => console.log(err));
		}
		if (name === 'picture') {
			api.updatePicture(user.pictureToUpdate).then((res) => setUser(res)).catch((err) => console.log(err));
		}
	}

	//delete profile
	function handleDelete() {
		api
			.deleteProfile()
			.then((res) => {
				props.history.push('/signup');
			})
			.catch((err) => console.log(err));
	}

	//charts
	function formatStates(arr) {
		let each = arr.map((v) => v.carbon);
		let averageNumber = Math.round(each.reduce((acc, cv) => acc + cv, 0) / each.length * 100) / 100;
		let labels = [];
		let average = [];
		for (let i = 1; i < arr.length + 1; i++) {
			labels.push(i);
			average.push(averageNumber);
		}

		setStatistics({ ...statistics, each, average, labels });
	}

	useEffect(() => {
		api
			.getSavedTrip()
			.then((res) => {
				console.log('TRIP ??????', res);
				setTrip(res);
				formatStates(res);
			})
			.catch((err) => console.log(err));
		/*Eslint-disabled */
	}, []);

	let labelounes = [ 1, 2, 3 ];

	return (
		<div className="profile">
			<div className="profile_info">
				<h1>Profile</h1>
				<br />
				<div className="profile_image">
					<img style={{ width: '100%' }} src={user.picture} alt="img" />
				</div>
				<div className="profile_detail_info">
					<div className="edit_items">
						<label>
							<strong>Name </strong>
						</label>
						<input
							className="input_profile"
							type="text"
							name="name"
							value={user.name}
							onChange={handleOnChange}
						/>
						<button onClick={handleClickButton} className="edit-btn">
							<i className="fas fa-pencil-alt" />
						</button>
					</div>
					<div className="edit_items">
						<label>
							<strong>Email</strong>
						</label>
						<input
							className="input_profile"
							type="text"
							name="email"
							value={user.email}
							onChange={handleOnChange}
						/>
						<button onClick={handleClickButton} className="edit-btn">
							<i className="fas fa-pencil-alt" />
						</button>
					</div>
					<div className="edit_items">
						<label>
							<strong>Profile picture</strong>
						</label>
						<input className="input_profile" type="file" name="picture" onChange={handleOnChange} />{' '}
						<button onClick={handleClickButton} className="edit-btn">
							<i className="fas fa-pencil-alt" />
						</button>
					</div>
				</div>
				<button className="btn-delete" onClick={handleDelete}>
					Delete account
				</button>
			</div>
			<div className="profile_trips">
				<h1 style={{ textAlign: 'center' }}>Your trips</h1>
				<div className="trip_details">
					{trip.map((trips, i) => (
						<ul key={i}>
							<h2>Trip n° {[ i + 1 ]}</h2>

							<li>
								<strong className="title_detail">Departure : </strong> {trips.departure}
							</li>
							<li>
								<strong className="title_detail">Arrival : </strong>
								{trips.arrival}
							</li>
							<li>
								<strong className="title_detail">Transport : </strong>
								{trips.transport}
							</li>
							<li>
								<strong className="title_detail">Duration : </strong>
								{trips.duration}
							</li>
							<li>
								<strong className="title_detail">Distance : </strong>
								{trips.distance} km
							</li>
							<li>
								<strong className="title_detail">Cabron footprint : </strong>
								{trips.carbon} kg
							</li>
						</ul>
					))}
				</div>
			</div>
			{/* 
      <CarbonOverTime
        title={'Carbon stack'}
        width={'50vw'}
        height={'50vh'}
        labels={labelounes}
        // data={statistics}
      /> */}

			<CarbonOverTime
				title={'Carbon stack'}
				width={'50vw'}
				height={'50vh'}
				labels={statistics.labels}
				data={{
					each: statistics.each,
					average: statistics.average
				}}
			/>

			<TripsDoughnut width={'50vw'} height={'50vh'} labels={labelounes} data={[ 1, 2, 3 ]} />
		</div>
	);
}
