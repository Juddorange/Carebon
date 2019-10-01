import React from 'react'
import { Doughnut } from 'react-chartjs-2'

export default function TripsDoughnut(props) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        data: props.data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
    options: { maintainAspectRatio: false, responsive: true },
  }

  return (
    <div>
      <h2>Dynamicly refreshed Doughnut Example</h2>
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
