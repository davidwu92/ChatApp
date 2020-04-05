require('dotenv').config()
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = requires('cors')
// const { join } = require('path')

const PORT = process.env.PORT || 3001

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//this gets us those helper functions from users.js!
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js')

//In our server, we run methods that allow us to CONNECT and DISCONNECT from socket.io.
io.on('connection', (socket)=>{ //this is a socket that'll be connected as a client side socket.
  
  console.log("We have a new connection!")

  //RECEIVES information from the front end. In Chat.js, we EMITTED an event called 'join'.
  //so this all happens when somebody JOINS the room. We emit out some admin-generated messages when someone joins the room.
  socket.on('join',({name, room}, callback)=>{
    const{error, user} = addUser({id: socket.id, name, room}) //remember, addUser needs id, name and room.
    if (error) return callback(error) //this callback is handled if there's an error. We defined this error as "Username is taken" in users.js.
    
    //if there aren't any errors...
    //Let's emit a message to the user from admin to welcome them.
    socket.emit('message',{user:'admin', text:`Hi ${user.name}! Welcome to the room ${user.room}.`})
    
    //This method sends a message to EVERYONE in that room besides that user.
    //Don't forget we need to broadcast.to(user.room)!
    socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined!`})

    //This socket method: Join; this joins a user into a room. Simple.
    socket.join(user.room)
    //when user is finally in the room, we can handle the fun stuff: messaging and such.
    
    //show who else is in the room!
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    callback()
  })
  
  //user-generated messages!
  //We'll be waiting for 'sendMessage' to happen on the front end.
  socket.on('sendMessage', (message, callback)=>{
    const user = getUser(socket.id)
    io.to(user.room).emit('message', {user: user.name, text: message})
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    callback() //this callback will run after the user has sent something on the front end.
  })

  socket.on('disconnect', ()=>{
    console.log("User has left the socket.")
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('message', {user: "admin", text:`${user.name} has left.`})
    }
  })
})

app.use(router);
app.use(cors())

server.listen(PORT, ()=>{console.log(`Server has started on port ${PORT}`)})

// const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/liarsdicedb'
// const mongoose = require('mongoose')
// const conn = mongoose.createConnection(mongoURI, {
//   // these methods are rarely used
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

// //middleware
// app.use(express.static(join(__dirname, 'client', 'build')))
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// //DEPLOYING TO HEROKU
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"))
// }

// //routes
// require('./routes')(app)

// //Catches all; sends any routes NOT found in the server directly into our home.
// app.get('*', (req, res) => res.sendFile(join(__dirname, 'client', 'build', 'index.html')))

// //connect to the database and listen on a port
// require('mongoose')
//   .connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/liarsdicedb', {
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     app.listen(process.env.PORT || 3001)
//   })
//   .catch(e => console.error(e))
