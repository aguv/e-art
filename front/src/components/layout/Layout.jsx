import React from 'react'
import Navbar from './Navbar';
import SecondNavbar from './SecondNavbar';

const Layout = () => {
    return (
        <div className='mb-16 min-w-screen'>
            <Navbar />
            <SecondNavbar />
        </div>
    )
}

export default Layout
