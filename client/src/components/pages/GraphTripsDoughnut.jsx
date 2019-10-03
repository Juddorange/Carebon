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
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
    options: { maintainAspectRatio: false, responsive: true },
  }

  return (
    <div>
      <h2>Preferred modes of travel</h2>
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
