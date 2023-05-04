import React from 'react'

export default function Footer({bgColor}) {
  const styleBg = `${bgColor}`
  return (
    <div className={`${styleBg}`}>
      <p>Hey</p>
    </div>
  )
}
