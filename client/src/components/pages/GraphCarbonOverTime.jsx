import React from 'react'
import { Line } from 'react-chartjs-2'

export default function GraphCarbonOverTime(props) {
  const options = {
    maintainAspectRatio: true,
    responsive: true,
    tooltips: {
      callbacks: {
        // title: function(tooltipItem, data) {
        //   console.log('tooltipItem', tooltipItem)
        //   console.log('data', data)

        //   var labello = data.toolTipLabels[tooltipItem.index]

        //   return labello
        // },

        label: function(tooltipItem, data) {
          var labello = data.toolTipLabels[tooltipItem.index]
          var value = tooltipItem.value
          return [labello, value + 'kgs']
        },
        // labelColor: function(tooltipItem, chart) {
        //   return {
        //     borderColor: 'rgb(255, 0, 0)',
        //     backgroundColor: 'rgb(255, 0, 0)',
        //   }
        // },
        // labelTextColor: function(tooltipItem, chart) {
        //   return '#543453'
        // },
      },
    },
  }
  const data = {
    labels: props.labels,
    toolTipLabels: props.toolTipLabels,
    datasets: [
      {
        label: 'Carbon in kgs',
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
        data: props.data.carbonEmittedPerTrip,
      },
      {
        label: 'Average',
        fill: false,
        lineTension: 0.3,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#fa990e',
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
        data: props.data.average,
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
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
