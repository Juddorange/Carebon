import React from 'react'
import MyMapComponent from './MyMapComponent'

export default function Search(props) {
  let transports = props.trip.transports
  function timeConvert(n) {
    var num = n
    var hours = num / 60
    var day = hours / 24
    var hour = hours - 24 * day
    var rhours = Math.floor(hours)
    var rhour = Math.floor(hour)
    var minutes = (hours - rhours) * 60
    var rminutes = Math.round(minutes)
    var rday = Math.round(day)
    if (rday > 1 && rhour > 0)
      return rday + ' days ' + rhour + ' h ' + rminutes + ' min '
    if (rday > 1 && rhour === 0) return rday + ' days ' + rminutes + ' min '
    if (rhours > 24 && rhour > 0)
      return rday + ' day ' + rhour + ' h ' + rminutes + ' min '
    if (rhours > 24 && rhour === 0) return rday + ' day ' + rminutes + ' min '
    else if (rhours > 0) return rhours + ' h ' + rminutes + ' min'
    else return rminutes + ' min'
  }
  return (
    <div className="Home">
      <h2>TRACK A JOURNEY</h2>
      <form action="" onSubmit={props.onSubmit} className="searchForm">
        <input
          className="searchInput"
          type="text"
          name="origin"
          value={props.trip.origin}
          onChange={props.onChange}
          placeholder="Departure"
        />
        <input
          className="searchInput"
          type="text"
          name="destination"
          value={props.trip.destination}
          onChange={props.onChange}
          placeholder="Destination"
        />
        <div className="checkbox">
          <label className="labelCheckbox">Return Trip</label>
          <input
            type="checkbox"
            name="return"
            value={props.trip.return}
            id="return"
            onChange={props.onChange}
          />
        </div>
        <button className="searchBtn">GO</button>
      </form>
      <div className="tripsAnswer">
        {props.trip.errorMsg ? (
          <p className="errorSearch">{props.trip.errorMsg}</p>
        ) : (
          ''
        )}
        {!transports.length ? (
          ''
        ) : (
          <div className="firstAnswer">
            <ul>
              <li className="iconLi">MODE</li>
              <li className="textLi">DISTANCE</li>
              <li className="textLi">DURATION</li>
              <li className="textLi">CARBON FOOTPRINT</li>
              <li className="btnLi" />
              <li className="btnLi" />
            </ul>
          </div>
        )}
        {transports
          .sort((m1, m2) => {
            if (m1.carbon > m2.carbon) return 1
            else if (m1.carbon < m2.carbon) return -1
            else {
              if (m1.time > m2.time) return 1
              if (m1.time < m2.time) return -1
            }
          })
          .map((mode, i) =>
            !mode.error ? (
              <div className="answer" key={i}>
                {props.trip.return === true ? (
                  <ul>
                    <li className="iconLi">
                      {(mode.mode === 'Car' && <i className="fas fa-car" />) ||
                        (mode.mode === 'Train' && (
                          <i className="fas fa-train" />
                        )) ||
                        (mode.mode === 'Bicycle' && (
                          <i className="fas fa-biking" />
                        )) ||
                        (mode.mode === 'Walking' && (
                          <i className="fas fa-walking" />
                        ))}
                    </li>
                    <li className="textLi">{mode.distance * 2} km</li>
                    <li className="textLi">{timeConvert(mode.time * 2)}</li>
                    <li className="textLi">{mode.carbon * 2} kg</li>
                    <li className="btnLi">
                      <button
                        className="saveTrip"
                        onClick={() => props.onClickSave(i)}
                      >
                        {transports.visited ? (
                          <i class="fas fa-bookmark" />
                        ) : (
                          <i className="far fa-bookmark" />
                        )}
                      </button>
                    </li>
                    <li className="btnLi">
                      <button className="addTrip">Add</button>
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li className="iconLi">
                      {(mode.mode === 'Car' && <i className="fas fa-car" />) ||
                        (mode.mode === 'Train' && (
                          <i className="fas fa-train" />
                        )) ||
                        (mode.mode === 'Bicycle' && (
                          <i className="fas fa-biking" />
                        )) ||
                        (mode.mode === 'Walking' && (
                          <i className="fas fa-walking" />
                        ))}
                    </li>
                    <li className="textLi">{mode.distance} km</li>
                    <li className="textLi">{timeConvert(mode.time)}</li>
                    <li className="textLi">{mode.carbon} kg</li>
                    <li className="btnLi">
                      <button
                        className="saveTrip"
                        onClick={() => props.onClickSave(i)}
                      >
                        {/* {props.savedTrip.includes(transports[i]) ? ( */}
                        <i className="far fa-bookmark" />
                        {/* ) : (
                          <i class="fas fa-bookmark"></i>
                        )} */}
                      </button>
                    </li>
                    <li className="btnLi">
                      <button className="addTrip">0</button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              ''
            )
          )}
      </div>
      <MyMapComponent />
    </div>
  )
}
