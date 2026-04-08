import React from 'react'

function Button(props) {
  return (
    <>
        <a href="" className={`btn ${props.class}`}>{props.text}</a>
    </>
  )
}

export default Button