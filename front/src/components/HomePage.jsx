import React from 'react'
import List from './List';
import CustomCarousel from './CustomCarousel';
import Popup from './PopupForm';

const HomePage = () => {
        return (
        <div>
            <h1 class='font-mono text-8xl text-center mb-20 text-primary'>E-Art</h1>
            <CustomCarousel />
            <List />
            <List />
            <List />
            <Popup/>
        </div>
    )
}

export default HomePage
