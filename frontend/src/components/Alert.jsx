import React from 'react'
import '../css/Alert.css'

export default function Alert(props) {
  return (
    <div className={`alert alert-${props.type}`} role="alert">
       {props.message}
   </div>
  )
}