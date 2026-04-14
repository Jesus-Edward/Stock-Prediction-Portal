import React, { useState, useContext } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import axiosRequest from '../interceptor/axiosInterceptor'

function Login() {
  const [user, setUser] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axiosRequest.post('/token/', user)
      setErrors('')
      setSuccess(true)

      localStorage.setItem('accessToken', res.data.access)
      localStorage.setItem('refreshToken', res.data.refresh)
      setIsLoggedIn(true)

      navigate('/dashboard')

    } catch (error) {
      setErrors(error.response.data)
      console.log('Login unsuccessful ', error.response.data);

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 bg-light-dark p-5 rounded">
            {
              errors && <div className='alert alert-danger '>Invalid Credentials</div>
            }
            <h3 className="text-light text-center my-3">Sign In to our Portal</h3>

            <form onSubmit={handleSubmit} method="post">
              <div className='mb-3'>
                <input type="text" className="form-control" placeholder='Enter Username' value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
              </div>

              <div className="mb-5">
                <input type="password" className="form-control" placeholder='Enter Password' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
              </div>

              {
                loading ? (<button type='submit' className='btn btn-info d-block mx-auto mb-3' disabled><FontAwesomeIcon icon={faSpinner} spin /> Logging In.</button>) : (<button type='submit' className='btn btn-info d-block mx-auto mb-3'>Login</button>)
              }

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login