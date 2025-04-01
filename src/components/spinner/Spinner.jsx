import React from 'react'
import './Spinner.css'

const Spinner = ({ color }) => {

  const spinnerStyle = color ? { '--spinner-color': color } : {};

  return (
    <div className="sk-chase" style={spinnerStyle}>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
    </div>
  )
}

export default Spinner