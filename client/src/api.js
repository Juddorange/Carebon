import axios from 'axios'

console.log(process.env.NODE_ENV)

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : `http://${window.location.hostname}:5000/api`,

  withCredentials: true,
})

const errHandler = err => {
  console.error(err)
  if (err.response && err.response.data) {
    console.error('API response', err.response.data)
    throw err.response.data.message
  }
  throw err
}

export default {
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
  signup(userInfo) {
    return service
      .post('/signup', userInfo)
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

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

  // This is an example on how to use this method in a different file
  // api.getCountries().then(countries => { /* ... */ })
  // getTripOld(origin, destination) {
  //   return service
  //     .get(
  //       `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_KEY}`
  //     )
  //     .then()
  //     .catch()
  // },

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

  // const modes = ["driving", "walking", "transit"];
  // let transitMode = null

  // let driving = this.getGoogleTrip(
  //   origin,
  //   destination,
  //   'driving',
  //   transitMode
  // )
  // let walking = this.getGoogleTrip(
  //   origin,
  //   destination,
  //   'walking',
  //   transitMode
  // )
  // let training = this.getGoogleTrip(origin, destination, 'transit', 'train')
  // let busing = this.getGoogleTrip(origin, destination, 'transit', 'bus')

  // return Promise.all([driving, walking, training, busing])
  //   .then(values => {
  //     let car = values[0]
  //     let foot = values[1]
  //     let train = values[2]
  //     let bus = values[3]
  //     console.log('car :', car)
  //     console.log('foot :', foot)
  //     console.log('train :', train)
  //     console.log('bus :', bus)
  //   })
  //   .catch(err => console.log(err))

  // First idea, on hold
  // modes.map(mode => {
  //   if (mode !== "transit")
  //     this.getGoogleTrip(origin, destination, mode, (transitMode = null));
  //   else {
  //     let transitOptions = [];
  //     transitMode = ["train", "bus"];
  //     this.getGoogleTrip(origin, destination, mode, transitmode);
  //   }
  // });
  // },

  addCountry(body) {
    return service
      .post('/countries', body)
      .then(res => res.data)
      .catch(errHandler)
  },

  getSecret() {
    return service
      .get('/secret')
      .then(res => res.data)
      .catch(errHandler)
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
      .then(res => res.data)
      .catch(errHandler)
  },
}
