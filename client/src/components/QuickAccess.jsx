import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

export default function QuickAccess() {
  return (
    <>
     <Link className='fixed z-50 bottom-5 left-5' href="/expenses/add">
      <Button variant="outline" size="lg" className="w-full cursor-pointer text-white hover:bg-orange-600/50 bg-orange-600 p-6">
        <Plus className='size-6'/>
      </Button>
     </Link>
     <Link className='fixed z-50 bottom-5 right-5' href="/incomes/add">
      <Button variant="outline" size="lg" className="w-full cursor-pointer text-white hover:bg-green-600/50 bg-green-600 p-6">
        <Plus className='size-6'/>
      </Button>
     </Link>
    </>
  )
}
