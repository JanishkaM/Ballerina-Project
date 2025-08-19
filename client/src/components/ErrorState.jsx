import React from 'react'

export default function ErrorState({ message }) {
  return (
    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2">
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  )
}
