import Incomes from '@/components/base/Incomes'
import PageContainer from '@/components/PageContainer'
import React from 'react'

export default function page() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold">List of Incomes</h1>
      <div className="rounded-lg border p-4">
        <Incomes />
      </div>
    </PageContainer>
  )
}
