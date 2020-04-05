import React, {useState, useEffect} from 'react'
import queryString from 'query-string' //retrieves data from the url!
import io from 'socket.io-client'
import './Chat.css'

import InfoBar from './../InfoBar'
import Messages from './../Messages'
import Input from './../Input'
import TextContainer from './../TextContainer'

//here's where most of the socket.io logic will be stored.
//create an empty variable outside of the component.
let socket;

const Chat =({location}) => { //pass in the URL; it comes from react router!
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('')
  const ENDPOINT = 'localhost:3001'

  //this useEffect is for joining a room. It'll run whenever theres a change to ENDPOINT or the url.
  useEffect(()=>{
    const {name, room} = queryString.parse(location.search)
    socket = io(ENDPOINT)
    setName(name)
    setRoom(room)
    console.log(socket)
    //emit lets us pass in strings and data! This data can be received on backend.
    //the event will be called JOIN. on Join, we pass the object w/ our NAME and our ROOM.
    //as a 3rd parameter, we can pass an error-handling callback!
    socket.emit('join', {name, room},()=>{
    });
    
    //used for disconnect/unmounting (leaving chat)
    return ()=>{
      socket.emit('disconnect')
      socket.off()
    }
  },[ENDPOINT, location.search])


  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  //this useEffect is for MESSAGING. Runs whenever there's a change to Messages array.
  useEffect(()=>{
    socket.on('message', (message)=>{
      setMessages([...messages, message]) //whenever a message ie sent, push to messages array.
    })
    socket.on("roomData", ({users})=>{
      setUsers(users)
    })
  },[messages, users])

  //function for sending messages.
  const sendMessage = (event)=>{
    event.preventDefault()
    if(message){ //if there's a message, emit that message to the server!
      socket.emit('sendMessage', message, ()=>setMessage(''))
    }
  }

  console.log(message, messages)

  return(
    <>
      <div className="outerContainer">
        <div className="container">
          {/* We need to pass off our ROOM property to the infobar! */}
          <InfoBar room={room}/> 

          {/* Messages. Shows all past messages. */}
          <Messages messages={messages} name={name}/>

          {/* Input component needs message, setMessage, and sendMessage. */}
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
        <TextContainer users={users}/>
      </div>
    </>
  )
}

export default Chat