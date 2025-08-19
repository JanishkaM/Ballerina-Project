import Form from '@/components/Form'
import PageContainer from '@/components/PageContainer'
import React from 'react'

export default function page() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold">Add Income</h1>
  <Form apiEndpoint="/income/add" />
    </PageContainer>
  )
}
