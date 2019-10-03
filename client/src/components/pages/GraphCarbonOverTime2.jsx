import React from 'react'
import { Line } from 'react-chartjs-2'

export default function GraphCarbonOverTime(props) {
  const data = {
    labels: ['toto', 'momo', 'tata', 'mama'],
    datasets: [
      {
        label: 'Carbon emitted',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 50,
        data: [1, 2, 3, 20, 32],
        options: { maintainAspectRatio: false, responsive: true },
      },
    ],
  }

  return (
    <div>
      <h2>{props.title}</h2>
      <div
        style={{
          height: props.height,
          width: props.width,
          position: 'relative',
        }}
        className="line-chart-container"
      >
        <Line data={data} />
      </div>
    </div>
  )
}
