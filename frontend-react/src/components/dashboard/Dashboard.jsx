import React, { useEffect, useState } from 'react'
import axiosRequest from '../../interceptor/axiosInterceptor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


function Dashboard() {

    const [ticker, setTicker] = useState('')
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [maPlot, setMaPlot] = useState()
    const [dma200Plot, setDma200Plot] = useState()
    const [predictedPlot, setPredictedPlot] = useState()
    const [mse, setMse] = useState()
    const [rse, setRse] = useState()
    const [r2, setR2] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await axiosRequest.post('/predict', { ticker: ticker })
            if (res.data.error){
                setError(res.data.error)
            }
            setError('')
            console.log(res.data)
            const plotUrl = `${import.meta.env.VITE_BACKEND_ROOT}${res.data.plot_img}`
            const maPlotUrl = `${import.meta.env.VITE_BACKEND_ROOT}${res.data.dma_100_img}`
            const dma200PlotUrl = `${import.meta.env.VITE_BACKEND_ROOT}${res.data.dma_200_img}`
            const predictedPlotUrl = `${import.meta.env.VITE_BACKEND_ROOT}${res.data.predicted_img}`
            // console.log(plotUrl);
            // console.log(maPlotUrl);

            setPlot(plotUrl)
            setMaPlot(maPlotUrl)
            setDma200Plot(dma200PlotUrl)
            setPredictedPlot(predictedPlotUrl)

            setMse(res.data.mse)
            setRse(res.data.rse)
            setR2(res.data.r2)

        } catch (error) {
            console.error('There was a problem sending the request', error)
        } finally {
            setLoading(false)
            setTicker('')
        }
        
    }

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const res = await axiosRequest.get('/protected-view')
            } catch (error) {
                console.log('Error fetching data ', error)
            }
        }
        fetchProtectedData()
    }, [])
    return (
        <>
            <div className='container'>
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded mx-auto">
                    <h3 className="text-light text-center mb-3">Enter Your Stock Ticker</h3>
                        <form onSubmit={handleSubmit} method='POST'>
                            <div className='mb-2'>
                                <input type="text" className="form-control" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder='Enter Stock Ticker' required />
                                {error && <div className='text-danger mt-2'>{error}</div>}
                            </div>

                            <button type='submit' className='btn btn-primary'>
                                {loading ? <span><FontAwesomeIcon icon={faSpinner} spin />Please wait...</span> : 'See Predictions'}
                            </button>
                        </form>
                    </div>
                </div>

                { predictedPlot && (
                    <div className="prediction mt-5">
                        <div className="p-3">
                            {
                                plot && (
                                    <img src={plot} alt="Stock Plot" style={{maxWidth:'100%'}} />
                                )
                            }
                        </div>
                        <div className="p-3">
                            {
                                maPlot && (
                                    <img src={maPlot} alt="Moving Average Plot" style={{maxWidth:'100%'}} />
                                )
                            }
                        </div>
                        <div className="p-3">
                            {
                                dma200Plot && (
                                    <img src={dma200Plot} alt="200 Days Moving Average Plot" style={{maxWidth:'100%'}} />
                                )
                            }
                        </div>
                        <div className="p-3">
                            {
                                predictedPlot && (
                                    <img src={predictedPlot} alt="Predicted Plot" style={{maxWidth:'100%'}} />
                                )
                            }
                        </div>

                        <div className="p-3 bg-light-dark rounded mt-4  text-light">
                            <h4>Model Evaluation Metrics</h4>
                            <p><strong>Mean Squared Error (MSE):</strong> {mse}</p>
                            <p><strong>Root Squared Error (RSE):</strong> {rse}</p>
                            <p><strong>R-squared (R2):</strong> {r2}</p>
                        </div>


                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard