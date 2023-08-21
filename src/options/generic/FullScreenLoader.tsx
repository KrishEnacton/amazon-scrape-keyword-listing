import React from 'react'
import { Spinner } from 'flowbite-react'

const FullScreenLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Spinner />
    </div>
  )
}

export default FullScreenLoader
