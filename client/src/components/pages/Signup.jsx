import React, { useState } from 'react'
import api from '../../api'

export default function Signup(props) {
  const [state, setState] = useState({
    email: '',
    name: '',
    password: '',
    picture: null,
    message: null,
  })

  function handleInputChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  function handleFileChange(event) {
    setState({
      ...state,
      picture: event.target.files[0],
    })
  }

  function handleClick(e) {
    e.preventDefault()
    api
      .addUser(state.email, state.name, state.password, state.picture)
      .then(result => {
        console.log('SUCCESS!')
        props.history.push('/') // Redirect to the home page
      })
      .catch(err => setState({ message: err.toString() }))
  }
  return (
    <div className="Signup">
      <h2>Signup</h2>
      <form>
        Email:{' '}
        <input
          type="email"
          value={state.email}
          name="email"
          onChange={handleInputChange}
        />{' '}
        <br />
        Name:{' '}
        <input
          type="text"
          value={state.name}
          name="name"
          onChange={handleInputChange}
        />{' '}
        <br />
        Password:{' '}
        <input
          type="password"
          value={state.password}
          name="password"
          onChange={handleInputChange}
        />{' '}
        <br />
        Picture:{' '}
        <input type="file" name="picture" onChange={handleFileChange}></input>
        <br />
        <button onClick={e => handleClick(e)}>Signup</button>
      </form>
      {state.message && <div className="info info-danger">{state.message}</div>}
      <pre>{JSON.stringify(state)}</pre>
    </div>
  )
}
