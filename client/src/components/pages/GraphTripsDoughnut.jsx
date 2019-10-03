import React from 'react'
import { Doughnut } from 'react-chartjs-2'

export default function GraphTripsDoughnut(props) {
  let tripsModes = []
  let tripsValues = []
  for (let element in props.data) {
    tripsModes.push(element)
    tripsValues.push(props.data[element])
  }

  const data = {
    labels: tripsModes,
    datasets: [
      {
        data: tripsValues,
        backgroundColor: ['#a5dbe5', ' #5b8d27', '#fecc46', '#fa990e'],
        hoverBackgroundColor: ['#a5dbe5', ' #5b8d27', '#fecc46', '#fa990e'],
      },
    ],
    options: { maintainAspectRatio: false, responsive: false },
  }

  return (
    <div>
      <h2>PREFERRED MODES OF TRAVEL</h2>
      <div
        style={{
          height: props.height,
          width: props.width,
          position: 'relative',
        }}
        className="doughnut-container"
      >
        <Doughnut data={data} />
      </div>
    </div>
  )
}
