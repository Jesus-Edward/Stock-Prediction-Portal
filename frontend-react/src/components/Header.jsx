import React, { useContext } from 'react'
import Button from './common/Button'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

function Header() {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
  }
  
  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>
        <Link to='/' className='navbar-brand text-light'>Stock Prediction Portal</Link>

      {
          isLoggedIn ? (
          <>
            <div>
              <Button url='/dashboard' class='btn-info' text='Dashboard' />
              &nbsp;
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) :
        (<div>
          <Button url='/login' text='Login' class='btn-outline-info' />
          &nbsp;
          <Button url='/register' text='Register' class='btn-info' />
        </div>)
      }
      </nav>
    </>
  )
}

export default Header