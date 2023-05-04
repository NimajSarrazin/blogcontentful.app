import React from 'react'

export default function heroHome({bg, title, content}) {
    const bgStyle = {bg}
  return (
    <div className={`${bgStyle}`}>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
