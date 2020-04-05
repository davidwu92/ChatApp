const { WebApp } = require('../models')

module.exports = app => {
  // DUMMY ROUTES

  // GET all web apps
  app.get('/webapps', (req, res) => {
    WebApp.find({})
      .then((data)=>{res.json(data)})
      .catch(e=>console.error(e))
  })
}