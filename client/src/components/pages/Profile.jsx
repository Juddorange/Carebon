import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function Profile() {
	const [ user, setUser ] = useState([]);
	useEffect(() => {
		api
			.getProfile()
			.then((res) => {
				console.log(res);
				setUser(res);
			})
			.catch((err) => console.log(err));
	}, []);

	function handleFileChange(event) {
		setUser({
			...user,
			picture: event.target.files[0]
		});
	}

	function handleClickPicture(e) {
		api.addPicture(user.picture).then((res) => console.log(res)).catch((err) => console.log(err));
	}

	return (
		<div className="profile">
			<h1>Profile</h1>
			<br />
			<div className="profil_image">
				<img style={{ height: '300px' }} src={user.picture} alt="img" />
			</div>
			<div>
				<label>Name : </label>
				<input type="text" name="name" value={user.name} />
				<button className="edit-btn">
					<i className="fas fa-pencil-alt" />
				</button>
				<br />
				<label>Email : </label>
				<input type="text" name="email" value={user.email} />
				<button className="edit-btn">
					<i className="fas fa-pencil-alt" />
				</button>
				<br />
				<label>Password : </label>
				<input type="password" name="password" value={user.password} />
				<button className="edit-btn">
					<i className="fas fa-pencil-alt" />
				</button>
				<br />
				<label>Profile picture : </label>
				<input type="file" name="avatar" onChange={handleFileChange} />
				<button onClick={handleClickPicture} className="edit-btn">
					change
				</button>
				<br />
			</div>
			<button>Delete account</button>
		</div>
	);
}
