import React from 'react'

export default function CardTitleAbout({title, subtitle}) {
  return (
    <div className='text-center mt-5'>
        <h5 className='text-lg font-medium text-gray-400'>
            {title}
        </h5>
        <h3 className='text-2xl font-medium text-gray-700'>
            {subtitle}
        </h3>
    </div>
  )
}
