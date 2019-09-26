import React from 'react'
import api from '../../api'

export default function Test() {
  let a = 'Paris'
  let b = 'Lyon'
  function handleClick() {
    api.getEveryAnswer(a, b)
  }
  return (
    <div>
      <button onClick={handleClick}>TEST ME</button>
    </div>
  )
}
