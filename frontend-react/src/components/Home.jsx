import React from 'react'
import Button from './common/Button'

function Home() {
  return (
    <>
       <div className="container">
        <div className="p-3 text-center bg-light-dark rounded">
            <h1 className='text-light'>Stock Prediction Portal</h1>
            <p className="text-light lead">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quo fugiat fugit voluptatibus! Repellat voluptatum quam doloremque pariatur! Ipsa molestias laboriosam quisquam alias est quasi deleniti laborum autem numquam tempora!
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque quia, officiis voluptatum consequatur dolores, atque veniam error a iste ducimus pariatur cum obcaecati rerum. Corporis dolore tempora natus maxime nemo!
            </p>
            <Button url='/dashboard' class='btn-info' text='Explore Now' />
        </div>
       </div>
    </>
  )
}

export default Home