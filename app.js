const express = require('express')
const app = express()
const {
    getTopics,
    getEndpoints
} = require('./controllers/nc_news_controllers.js')

app.use(express.json())

app.get('/api', getEndpoints)

//Retuns an array of all topics
app.get('/api/topics', getTopics)

module.exports = app