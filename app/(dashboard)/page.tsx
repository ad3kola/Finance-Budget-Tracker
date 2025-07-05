import Activities from '@/components/dashboard/Activities'
import RecentTransactions from '@/components/dashboard/Recents'
import SalesOverview from '@/components/dashboard/SalesOverview'
import Stats from '@/components/dashboard/Stats'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function page() {
  return (
    <div className='w-full h-full p-8 flex flex-col gap-3'>
      {/* 1st Row */}
      <h2 className='text-xl font-medium'>Overview</h2>
      <Stats />

      {/* 2nd Row */}
      <div className='w-full grid grid-auto-cols-fr grid-cols-1 lg:grid-cols-3 gap-3'>
      <Activities />
      <SalesOverview />
    </div>
    {/* 3rd Row */}
    <div>
      <RecentTransactions />
    </div>
    </div>
  )
}

export default page
