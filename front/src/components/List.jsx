import React from 'react'
import Card from './Card';

const List = () => {

    const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    return (
        <div className='w-9/12 h-auto mx-auto'>
            <p className='font-mono mb-3'>Lorem ipsum</p>
            <hr />
            <div className='bg-secondary w-11/12 mx-auto flex mb-20 overflow-x-scroll'>
                {arr.map(() => (
                    <Card />
                ))}
            </div>
        </div>
    )
}

export default List
