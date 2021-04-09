import React from 'react'

const Navbar = () => {
    return (
        <div className='bg-red-400 text-gray-100 px-10 h-20 w-auto items-center justify-between shadow-lg flex border-b-2 border-red-700'>
            <p className='text-4xl'>E-Art</p>
            <input className='h-10 w-4/12 px-4 text-gray-900 focus:bg-gray-200 rounded-md myshadow2'
                placeholder='Search'
            />
            <div className='flex h-full'>
                <button className='border-b-4 border-red-400 hover:border-red-800 flex items-center mr-8'>
                    <p className='text-lg'>About us</p>
                </button>
                <button className='border-b-4 border-red-400 hover:border-red-800 flex items-center'>
                    <p className='text-lg'>Test</p>
                </button>
            </div>
        </div>
    )
}

export default Navbar
