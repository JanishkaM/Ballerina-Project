import React from 'react'

export default function SuccessState({ message }) {
  return (
    <div>
      <p className="text-green-500">{message}</p>
    </div>
  )
}
