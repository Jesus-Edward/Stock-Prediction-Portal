import React, { useEffect } from 'react'
import axios from 'axios'
import axiosRequest from '../../interceptor/axiosInterceptor'

function Dashboard() {

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        const fetchProtectedData = async () => {
            try {

                const res = await axiosRequest.get('/protected-view')
                console.log(res.data);

            } catch (error) {
                console.log('Error fetching data ', error)
            }
        }
        fetchProtectedData()
    }, [])
    return (
        <>
            <div className='container text-light'>Dashboard</div>
        </>
    )
}

export default Dashboard