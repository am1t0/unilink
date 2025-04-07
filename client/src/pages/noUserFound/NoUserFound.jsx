import React from 'react'
import "./nouserfound.css"

const NoUserFound = () => {
  return (
    <div className="noUserContainer">
        <div className="noUserContent">
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg"
            alt="No User"
            className="noUserImage"
          />
          <h2 className="noUserMessage">No User Found</h2>
          <p className="noUserDescription">
            The profile you are looking for does not exist or is currently unavailable.
          </p>
          <button className="goBackButton" onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
  )
}

export default NoUserFound