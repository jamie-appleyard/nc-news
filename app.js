const express = require('express')
const app = express()
const {
    getTopics,
    getEndpoints,
    getArticleByID,
    getArticles
} = require('./controllers/nc_news_controllers.js')

app.use(express.json())

//Returns a JSON object giving a representation of all endpoints
app.get('/api', getEndpoints)

//Retuns an array of all topics
app.get('/api/topics', getTopics)

//Returns an article object from the DB with an article_id matching the given parameter
app.get('/api/articles/:article_id', getArticleByID)

app.get('/api/articles', getArticles)

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
      response.status(err.status).send({status: err.status, msg: err.msg})
    }
    next(err)
})

app.use((err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(400).send({status:400, msg: 'Invalid ID parameter'})
    }
    next(err)
})

module.exports = app