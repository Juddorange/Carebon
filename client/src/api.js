import axios from 'axios';

console.log(process.env.NODE_ENV);

const service = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? '/api' : `http://${window.location.hostname}:5000/api`,

	withCredentials: true
});

const errHandler = (err) => {
	console.error(err);
	if (err.response && err.response.data) {
		console.error('API response', err.response.data);
		throw err.response.data.message;
	}
	throw err;
};

export default {
<<<<<<< HEAD
  service: service,

  // This method is synchronous and returns true or false
  // To know if the user is connected, we just check if we have a value for localStorage.getItem('user')
  isLoggedIn() {
    return localStorage.getItem('user') != null
  },

  // This method returns the user from the localStorage
  // Be careful, the value is the one when the user logged in for the last time
  getLocalStorageUser() {
    return JSON.parse(localStorage.getItem('user'))
  },

  // This method signs up and logs in the user

  addUser(email, name, password, picture) {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('name', name)
    formData.append('password', password)
    formData.append('picture', picture)
    return service
      .post('/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  // signup(userInfo) {
  //   return service
  //     .post('/signup', userInfo)
  //     .then(res => {
  //       // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
  //       localStorage.setItem('user', JSON.stringify(res.data))
  //       return res.data
  //     })
  //     .catch(errHandler)
  // },

  login(email, password) {
    return service
      .post('/login', {
        email,
        password,
      })
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  logout() {
    localStorage.removeItem('user')
    return service.get('/logout')
  },

  // This is an example on how to use this method in a different file
  getCarbon(distance, mode) {
    return service
      .post(`/trip`, { distance, mode })
      .then(res => res.data)
      .catch(errHandler)
  },

  // getGoogleTrip(origin, destination) {
  getEveryAnswer(origin, destination) {
    return service
      .post('/google-trip', {
        // toto: 'toto',
        origin,
        destination,
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
  },

  //GOOGLE API
  getTrip(origin, destination) {
    return service
      .get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_KEY}`
      )
      .then()
      .catch()
  },

  getTripTrain(origin, destination) {
    return service
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origins=${origin}&destination=${destination}&transit_mode=train&key=${process.env.GOOGLE_KEY}`
      )
      .then()
      .catch()
  },

  getProfile() {
    return service
      .get('/profile')
      .then(res => res.data)
      .catch(err => console.log(err))
  },

  // addPicture(file) {
  //   const formData = new FormData()
  //   formData.append('picture', file)
  //   return service
  //     .post('/signup', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data
  //       },
  //     })
  //     .then(res => res.data)
  //     .catch(errHandler)
  // },

  addPicture(file) {
    const formData = new FormData()
    formData.append('picture', file)
    return service
      .post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data)
      .catch(errHandler)
  },
}
=======
	service: service,

	// This method is synchronous and returns true or false
	// To know if the user is connected, we just check if we have a value for localStorage.getItem('user')
	isLoggedIn() {
		return localStorage.getItem('user') != null;
	},

	// This method returns the user from the localStorage
	// Be careful, the value is the one when the user logged in for the last time
	getLocalStorageUser() {
		return JSON.parse(localStorage.getItem('user'));
	},

	// This method signs up and logs in the user

	addUser(email, name, password, picture) {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('name', name);
		formData.append('password', password);
		formData.append('picture', picture);
		return service
			.post('/signup', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => {
				localStorage.setItem('user', JSON.stringify(res.data));
				return res.data;
			})
			.catch(errHandler);
	},

	// signup(userInfo) {
	//   return service
	//     .post('/signup', userInfo)
	//     .then(res => {
	//       // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
	//       localStorage.setItem('user', JSON.stringify(res.data))
	//       return res.data
	//     })
	//     .catch(errHandler)
	// },

	login(email, password) {
		return service
			.post('/login', {
				email,
				password
			})
			.then((res) => {
				// If we have localStorage.getItem('user') saved, the application will consider we are loggedin
				localStorage.setItem('user', JSON.stringify(res.data));
				return res.data;
			})
			.catch(errHandler);
	},

	logout() {
		localStorage.removeItem('user');
		return service.get('/logout');
	},

	// This is an example on how to use this method in a different file
	getCarbon(distance, mode) {
		return service.post(`/trip`, { distance, mode }).then((res) => res.data).catch(errHandler);
	},

	// getGoogleTrip(origin, destination) {
	getEveryAnswer(origin, destination) {
		return service
			.post('/google-trip', {
				// toto: 'toto',
				origin,
				destination
			})
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
	},

	//GOOGLE API
	getTrip(origin, destination) {
		return service
			.get(
				`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process
					.env.GOOGLE_KEY}`
			)
			.then()
			.catch();
	},

	getTripTrain(origin, destination) {
		return service
			.get(
				`https://maps.googleapis.com/maps/api/directions/json?origins=${origin}&destination=${destination}&transit_mode=train&key=${process
					.env.GOOGLE_KEY}`
			)
			.then()
			.catch();
	},

	getProfile() {
		return service.get('/profile').then((res) => res.data).catch((err) => console.log(err));
	},

	// addPicture(file) {
	//   const formData = new FormData()
	//   formData.append('picture', file)
	//   return service
	//     .post('/signup', formData, {
	//       headers: {
	//         'Content-Type': 'multipart/form-data
	//       },
	//     })
	//     .then(res => res.data)
	//     .catch(errHandler)
	// },

	addPicture(file) {
		const formData = new FormData();
		formData.append('picture', file);
		return service
			.post('/profile', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => res.data)
			.catch(errHandler);
	}
};
>>>>>>> 846a244b4e1e63677534b2d4446f3c3fc990d80b
