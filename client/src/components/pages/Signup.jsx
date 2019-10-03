import React, { useState } from 'react';
import api from '../../api';

export default function Signup(props) {
	const [ state, setState ] = useState({
		email: '',
		name: '',
		password: '',
		picture: null,
		message: null
	});

	function handleInputChange(event) {
		setState({
			...state,
			[event.target.name]: event.target.value
		});
	}

	function handleFileChange(event) {
		setState({
			...state,
			picture: event.target.files[0]
		});
	}

	function handleClick(e) {
		e.preventDefault();
		api
			.addUser(state.email, state.name, state.password, state.picture)
			.then((result) => {
				console.log('SUCCESS!');
				props.history.push('/'); // Redirect to the home page
			})
			.catch((err) => setState({ message: err.toString() }));
	}
	return (
		<div id="signup">
			<div className="signup">
				<h2 className="h2_signup">Signup</h2>
				<form>
					<div className="form">
						<div className="signup_detail">
							<label>
								<strong>Email </strong>
							</label>
							<input
								className="input_signup"
								type="email"
								value={state.email}
								name="email"
								onChange={handleInputChange}
								placeholder="Email"
							/>{' '}
						</div>
						<div className="signup_detail">
							<label>
								<strong>Name </strong>
							</label>
							<input
								className="input_signup"
								type="text"
								value={state.name}
								name="name"
								onChange={handleInputChange}
								placeholder="Name"
							/>{' '}
						</div>
						<div className="signup_detail">
							<label>
								<strong>Password </strong>
							</label>
							<input
								className="input_signup"
								type="password"
								value={state.password}
								name="password"
								onChange={handleInputChange}
								placeholder="Password"
							/>{' '}
						</div>
						<div className="signup_detail">
							<label>
								<strong>Picture</strong>
							</label>{' '}
							<input className="input_signup" type="file" name="picture" onChange={handleFileChange} />
						</div>
					</div>
					<div className="btn-signup-flex">
						<button className="btn-signup" onClick={(e) => handleClick(e)}>
							Signup
						</button>
					</div>
				</form>
				<strong>{state.message && <div className="info-danger">{state.message}</div>}</strong>
			</div>
		</div>
	);
}
