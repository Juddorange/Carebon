import React, { useState } from 'react';
import api from '../../api';
import { useForm } from '../../hooks';

export default function Login(props) {
	const { formValues, getInputProps } = useForm({ lang: 'en' });

	function handleSubmit(e) {
		e.preventDefault();
		api
			.login(formValues.email, formValues.password)
			.then((result) => {
				console.log('SUCCESS!');
				props.history.push('/'); // Redirect to the home page
			})
			.catch((err) => setMessage(err.toString()));
	}

	const [ message, setMessage ] = useState(null);

	return (
		<div id="login">
			<div className="login">
				<h2 className="h2_login">Login</h2>
				<form className="form-login" onSubmit={handleSubmit}>
					<div className="login-detail">
						<label>
							<strong>Email</strong>
						</label>
						<input className="input_login" type="email" {...getInputProps('email')} placeholder="Email" />
					</div>
					<div className="login-detail">
						<label>
							<strong>Password</strong>
						</label>
						<input
							className="input_login"
							type="password"
							{...getInputProps('password')}
							placeholder="Password"
						/>
					</div>
					<button className="btn-login">Login</button>
				</form>
				<strong>{message && <div className="info-danger">{message}</div>}</strong>
			</div>
		</div>
	);
}
