import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import axiosRequest from '../interceptor/axiosInterceptor'

function Register() {
  const [user, setUser] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // const handleChange = (e) => {
  //   const {name, value} = e.target
  //   setUser({...user, [name]: value})
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axiosRequest.post('/register/', user)
      console.log('res.data: ', res.data);
      console.log('registration successful')
      setErrors({})
      setSuccess(true)

      navigate('/login')

    } catch (error) {
      setErrors(error.response.data)
      console.log('Registration unsuccessful ', error.response.data);

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
              success && <div className='alert alert-success '>Registration Successful</div>
            }
            <h3 className="text-light text-center my-3">Register With Us</h3>

            <form onSubmit={handleSubmit} method="post">
              <div className='mb-3'>
                <input type="text" className="form-control" placeholder='Enter Username' value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                <small>{errors.username && <div className='text-danger'>{errors.username}</div>}</small>
              </div>

              <div className="mb-3">
                <input type="text" className="form-control" placeholder='Enter Email' value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                <small>{errors.email && <div className='text-danger'>{errors.email}</div>}</small>
              </div>

              <div className="mb-5">
                <input type="password" className="form-control" placeholder='Enter Password' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                <small>{errors.password && <div className='text-danger'>{errors.password}</div>}</small>
              </div>

              {
                loading ? (<button type='submit' className='btn btn-info d-block mx-auto mb-3' disabled><FontAwesomeIcon icon={faSpinner} spin /> Please Wait.</button>) : (<button type='submit' className='btn btn-info d-block mx-auto mb-3'>Register</button>)
              }

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register