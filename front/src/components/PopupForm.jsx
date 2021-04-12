import React, { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Popup = ({ handlePopup }) => {
    const [selectedFile, setSelectedFile] = useState(null)


    const fileSelectedHandler = event => {
        setSelectedFile(event.target.files[0])
        console.log(event.target.files[0].name)
    }

    const fileSubmitHandler = event => {
        event.preventDefault()
        this.props.mint(selectedFile)
    }

    return (
            <div className="fixed right-16 border-4 border-gray-400 rounded-md p-6 bg-gray-300 font-mono shadow-lg">
                <div className='flex flex-col popup'>
                    <div className='flex justify-between'>
                        <h3 className=''>Submit a token</h3>
                        <button onClick={handlePopup}>
                            <FontAwesomeIcon icon={faTimes} className='w-12 text-red-500'/>
                        </button>
                    </div>
                    <hr className='border-gray-400'/>
                    <form className='flex flex-col flex-1 justify-between'>
                        <div className='flex flex-col flex-1 justify-around'>
                            <input type="text" placeholder="Title" className='p-2 border-2 border-gray-400 rounded-md'></input>
                            <input type="text" placeholder="Address" className='p-2 border-2 border-gray-400 rounded-md'></input>
                            <input tyoe="text" placeholder="Price" className='p-2 border-2 border-gray-400 rounded-md'></input>
                            <input type="file" onChange={fileSelectedHandler} />
                        </div>
                        <hr className='border-gray-400'/>
                        <button type="submit" className="border-2 mt-4 border-gray-700 bg-red-400 p-2 rounded-md hover:bg-green-600 hover:text-gray-100">Submit</button>
                    </form>
                </div>
            </div>
    )
}

export default Popup


{/* <div className='absolute right-80 mr-20 h-screen'>
            <div className="fixed border-4 border-gray-400 rounded-md p-6 bg-gray-300 font-mono shadow-lg">
                <div className='flex flex-col popup'>
                    <div className='flex justify-between'>
                        <h3 className=''>Submit a token</h3>
                        <button onClick={handlePopup}>
                            <FontAwesomeIcon icon={faTimes} className='w-12 text-red-500'/>
                        </button>
                    </div>
                    <hr className='border-gray-400'/>
                    <form className='flex flex-col flex-1 justify-between'>
                        <div className='flex flex-col flex-1 justify-around'>
                            <input type="text" placeholder="Title" className='p-2 border-2 border-gray-400 rounded-md'></input>
                            <input type="text" placeholder="Address" className='p-2 border-2 border-gray-400 rounded-md'></input>
                            <input tyoe="text" placeholder="Price" className='p-2 border-2 border-gray-400 rounded-md'></input>
                            <input type="file" onChange={fileSelectedHandler} />
                        </div>
                        <hr className='border-gray-400'/>
                        <button type="submit" className="border-2 mt-4 border-gray-700 bg-red-400 p-2 rounded-md hover:bg-green-600 hover:text-gray-100">Submit</button>
                    </form>
                </div>
            </div>
        </div> */}