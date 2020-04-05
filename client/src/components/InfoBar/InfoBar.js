import React from 'react'
import './InfoBar.css'
import closeIcon from '../../icons/closeIcon.png'
import onlineIcon from '../../icons/onlineIcon.png'

const InfoBar = ({room}) =>(
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online"/>
      {/* room name here */}
      <h3>{room}</h3> {/* Chat.js passed the room state as Room into this component. */}
    </div>

    <div className="rightInnerContainer">
      {/* Close Icon. */}
      <a href="/"><img src={closeIcon} alt="close"/></a> 
    </div>
  </div>
) //since we're ONLY returning this JSX and no functions, we don't need { return("someJSXhere")}

export default InfoBar