const { model, Schema } = require('mongoose')

const WebApp = require('./WebApp.js')(model, Schema)

module.exports = {WebApp}