import React from 'react';
import api from '../api';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

function MainNavbar(props) {
	function handleLogoutClick(e) {
		api.logout();
	}
	return (
		<nav className="navbar">
			<NavLink className="link" to="/" exact>
				Home
			</NavLink>
			<NavLink className="link" to="/add-country">
				Add country
			</NavLink>
			{!api.isLoggedIn() && (
				<NavLink className="link" to="/signup">
					Signup
				</NavLink>
			)}
			{!api.isLoggedIn() && (
				<NavLink className="link" to="/login">
					Login
				</NavLink>
			)}
			{api.isLoggedIn() && (
				<NavLink className="link" to="/profile" onClick={handleLogoutClick}>
					Profile
				</NavLink>
			)}
			{api.isLoggedIn() && (
				<Link className="link" to="/" onClick={handleLogoutClick}>
					Logout
				</Link>
			)}
		</nav>
	);
}

export default withRouter(MainNavbar);
