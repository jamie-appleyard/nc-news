const express = require('express')
const app = express()
const {
    getTopics
} = require('./controllers/nc_news_controllers.js')

app.use(express.json())

//Retuns an array of all topics
app.get('/api/topics', getTopics)

module.exports = app