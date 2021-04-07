import React from 'react'
import List from './List';
import CustomCarousel from './CustomCarousel';

const HomePage = () => {
    return (
        <div>
            <h1 class='font-mono text-8xl text-center mb-20 text-primary'>E-Art</h1>
            <CustomCarousel />
            <List/>
            <List/>
            <List/>
        </div>
    )
}

export default HomePage
