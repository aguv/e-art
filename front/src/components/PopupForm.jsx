import React, { useState } from "react"

const Popup = ({props}) => {
    const [popup, setPopup] = useState(true)
    const [selectedFile, setSelectedFile] = useState(null)


    const fileSelectedHandler = event => {
        setSelectedFile(event.target.files[0])
        console.log(event.target.files[0].name)
    }

    const fileSubmitHandler = event => {
        event.preventDefault()
        this.props.mint(selectedFile)
    }

    return (popup) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-form">
                    <h3>Submit a token</h3>
                    <form onSubmit={fileSubmitHandler}>
                        <input type="text" placeholder="Title"></input>
                        <input type="text" placeholder="Address"></input>
                        <input tyoe="text" placeholder="Price"></input>
                        <input type="file" onChange={fileSelectedHandler} />
                        <button onClick={() => setPopup(false)} className="close-btn">Return</button>
                        <button className="submit-btn" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    ) : "";
}

export default Popup