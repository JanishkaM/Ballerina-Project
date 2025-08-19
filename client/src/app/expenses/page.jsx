import Expenses from '@/components/base/Expenses'
import PageContainer from '@/components/PageContainer'
import React from 'react'

export default function page() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold">List of Expenses</h1>
      <div className="rounded-lg border p-4">
        <Expenses />
      </div>
    </PageContainer>
  )
}
