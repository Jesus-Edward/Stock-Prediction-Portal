import React from 'react'
import Button from './common/Button'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
        <nav className='navbar container pt-3 pb-3 align-items-start'>
            <Link to='/' className='navbar-brand text-light'>Stock Prediction Portal</Link>

            <div>
                <Button url='/login' text='Login' class='btn-outline-info' />
                &nbsp;
                <Button url='/register' text='Register' class='btn-info' />
            </div>
        </nav>
    </>
  )
}

export default Header