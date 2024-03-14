import React from 'react'
import '../css/RefundItem.css'

export default function RefundItem({id, amount, status}) {
  return (
    <div className='refund-item display-flex align-center justify-between'>
      <span>{id}</span>
      <span>{amount}</span>
      <span>{status}</span>
    </div>
  )
}
