import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL
const axiosRequest = axios.create({
    baseURL: backend_url,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosRequest.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

axiosRequest.interceptors.response.use(function (response) {
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true
        const refreshToken = localStorage.getItem('refreshToken')
        try {
            const res = await axiosRequest.post('/token/refresh/', { refresh: refreshToken })
            localStorage.setItem('accessToken', res.data.access)
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`
            return axiosRequest(originalRequest)

        } catch (error) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
        return Promise.reject(error)
    }
})

export default axiosRequest