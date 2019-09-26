import React, { useState } from 'react';
import api from '../../api';

export default function AddCountry(props) {
	const [ state, setState ] = useState({
		distance: '',
		mode: ''
	});

	function handleInputChange(event) {
		setState({
			...state,
			[event.target.name]: event.target.value
		});
	}

	function handleClick(e) {
		e.preventDefault();
		console.log(state.distance, state.mode);
		let distance = state.distance;
		let mode = state.mode;
		api
			.getCarbon(distance, mode)
			.then((result) => {
				console.log('result', distance, mode, result);
			})
			.catch((err) => console.log(err));
	}
	return (
		<div className="AddCountry">
			<h2>Add country</h2>
			<form>
				distance: <input
					type="number"
					value={state.distance}
					name="distance"
					onChange={handleInputChange}
				/>{' '}
				<br />
				mode: <input type="text" value={state.mode} name="mode" onChange={handleInputChange} /> <br />
				<button onClick={(e) => handleClick(e)}>submit</button>
			</form>
			<pre>{JSON.stringify(state, null, 2)}</pre>
		</div>
	);
}
