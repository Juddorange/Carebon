import React from 'react'

export default function Search(props) {
  let transports = props.trip.transports
  console.log('Transports ', transports)
  return (
    <div className="Home">
      <h2>Where do you want to go?</h2>
      <p>{props.trip.errorMsg}</p>
      <form action="" onSubmit={props.onSubmit}>
        Departure:{' '}
        <input
          type="text"
          name="origin"
          value={props.trip.origin}
          onChange={props.onChange}
        />
        Arrival:{' '}
        <input
          type="text"
          name="destination"
          value={props.trip.destination}
          onChange={props.onChange}
        />
        <select
          name="return"
          value={props.trip.return}
          id="return"
          onChange={props.onChange}
          required
        >
          <option value="">Select an option</option>
          <option value="ONE WAY">One Way</option>
          <option value="RETURN TRIP">Return Trip</option>
        </select>
        <button>Go!</button>
      </form>
      <pre>{JSON.stringify(props.trip)}</pre>
      <div className="tripsAnswer">
        {transports
          .sort((m1, m2) => {
            if (m1.carbon > m2.carbon) return 1
            return -1
          })
          .map((mode, i) => (
            <div key={i}>
              <ul>
                <li>{mode.mode}</li>
                <li>{mode.distance} km</li>
                <li>{mode.time}</li>
                <li>Carbon footprint: {mode.carbon} kg</li>
                <li>
                  <button onClick={() => props.onClickSave(i)}>
                    Save this itinerary
                  </button>
                </li>
                <li>
                  <button onClick={() => props.onClickAdd(i)}>
                    Add a trip
                  </button>
                </li>
              </ul>
            </div>
          ))}
      </div>
    </div>
  )
}
