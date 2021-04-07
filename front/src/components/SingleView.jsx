import React from 'react'
import Card from './Card';

const SingleView = () => {
    return (
        <div className='bg-gray-300 w-6/12 h-80 mx-auto flex pl-4' >
            <Card />
            <div className='h-10/12 w-screen my-8 mr-4 p-2 flex flex-col border-solid border-2 border-red-300' >
                <div className='flex-1 ml-6'>
                    <p>Hola</p>
                </div>
                <div>
                    <button className='bg-red-300 border-solid border-4 border-gray-700 mx-6'>
                        BUY
                    </button>
                    <button className='bg-red-300 border-solid border-4 border-gray-700'>
                        WISHLIST
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SingleView

