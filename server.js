require('dotenv').config()
const express = require('express')
const { join } = require('path')
const app = express()

const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/liarsdicedb'
const mongoose = require('mongoose')
const conn = mongoose.createConnection(mongoURI, {
  // these methods are rarely used
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//middleware
app.use(express.static(join(__dirname, 'client', 'build')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//DEPLOYING TO HEROKU
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
}

//routes
require('./routes')(app)

//Catches all; sends any routes NOT found in the server directly into our home.
app.get('*', (req, res) => res.sendFile(join(__dirname, 'client', 'build', 'index.html')))

//connect to the database and listen on a port
require('mongoose')
  .connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/liarsdicedb', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT || 3001)
  })
  .catch(e => console.error(e))
