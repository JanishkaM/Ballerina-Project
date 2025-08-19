import React from 'react'

export default function LoadingState() {
  return (
    <div className="mt-2 rounded-md border border-muted bg-muted/30 px-3 py-2">
      <h2 className="font-semibold">Loading...</h2>
      <p className="text-muted-foreground text-sm">Please wait while we fetch the data.</p>
    </div>
  )
}
