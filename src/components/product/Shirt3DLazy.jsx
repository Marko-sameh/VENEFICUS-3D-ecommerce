'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const Shirt3D = dynamic(() => import('./Shirt3D'), {
  ssr: false,
  loading: () => (
    <div>
      <LoadingSpinner></LoadingSpinner>
    </div>
  )
})

export default function Shirt3DLazy(props) {
  return (
    <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
      <Shirt3D {...props} />
    </Suspense>
  )
}