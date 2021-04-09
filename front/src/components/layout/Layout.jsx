import React from 'react'
import Navbar from './Navbar';
import SecondNavbar from './SecondNavbar';

const Layout = () => {
    return (
        <div className='mb-12 min-w-screen font-mono'>
            <Navbar />
            <SecondNavbar />
        </div>
    )
}

export default Layout
