import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import TripsDoughnut from './TripsDoughnut'
import BarGraphTest from './BarGraphTest'
import LineCarbonGraph from './LineCarbonGraph'

export default function TestCharts() {
  //doughnut data
  // const data = {
  //   labels: ['Red', 'Blue', 'Yellow'],
  //   datasets: [
  //     {
  //       data: [300, 50, 100],
  //       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  //       hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  //     },
  //   ],
  // }
  return (
    <div>
      {/* <Doughnut
        data={data}
        width={40}
        height={30}
        options={{ maintainAspectRatio: false }}
      /> */}

      <TripsDoughnut
        width={30}
        height={30}
        options={{ maintainAspectRatio: false, responsive: true }}
      />

      <LineCarbonGraph
        width={'50vw'}
        height={'50vh'}
        options={{ maintainAspectRatio: false, responsive: true }}
        labels={['janvier', 'février', 'mars', 'avril']}
        data={[10, 22, 30, 90]}
      />
    </div>
  )
}
