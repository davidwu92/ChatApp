//lets create helper functions to manage users.
//JOINING IN, SIGNING OUT, removing/adding users. Even keeping track of which users are in what rooms.
const users = []

//add users
const addUser = ({id, name, room}) =>{
  //change the names: Javascript Mastery => javascriptmastery
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  const existingUser = users.find((user)=>user.room ===room && user.name===name) //find if there's already an existing user with the same name.
  if (existingUser){
    return{error: 'Username is taken.'}
  }
  const user = {id, name, room}
  users.push(user)
  return{user}
}

//remove users
const removeUser = (id) =>{
  const index = users.findIndex((user)=>user.id===id)
  if(index !=-1){
    return users.splice(index,1)[0]
  } //this removes the user from that users array.
}

//get user.
const getUser = (id) => users.find((user)=>user.id===id);

//get users in room
const getUsersInRoom = (room) => users.filter((user)=>user.room===room)

module.exports = {addUser, removeUser, getUser, getUsersInRoom}