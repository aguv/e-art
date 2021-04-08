import React, { useState } from "react"

const Popup = () => {
    const [popup, setPopup] = useState(true)
    return (popup) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-form">
                    <h3>Submit a token</h3>
                    <form>
                        <input type="text" placeholder="Title"></input>
                        <input type="text" placeholder="Address"></input>
                        <button onClick={() => setPopup(false)} className="close-btn">Return</button>
                        <button onClick={""}
                        className="submit-btn">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    ) : "";
}

export default Popup