const express = require('express')
const app = express()
const {
    getTopics,
    getEndpoints,
    getArticleByID,
    getArticles,
    getCommentsByArticleID,
    postCommentByArticleID,
    deleteComment,
    patchArticleByID,
    getAllUsers,
    getUserByUsername
} = require('./controllers/nc_news_controllers.js')

app.use(express.json())

//Returns a JSON object giving a representation of all endpoints
app.get('/api', getEndpoints)

//Retuns an array of all topics
app.get('/api/topics', getTopics)

//Returns an article object from the DB with an article_id matching the given parameter
app.get('/api/articles/:article_id', getArticleByID)

//Updates the votes amount on an article
app.patch('/api/articles/:article_id', patchArticleByID)

//Returns all articles with comment numbers
app.get('/api/articles', getArticles)

//Returns all comments with a specific article id
app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

//Posts a new comment with a specific article ID
app.post('/api/articles/:article_id/comments', postCommentByArticleID)

//Deletes comment by ID
app.delete('/api/comments/:comment_id', deleteComment)

//Get all users
app.get('/api/users', getAllUsers)

//Get a user object by username
app.get('/api/users/:username', getUserByUsername)

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
      response.status(err.status).send({status: err.status, msg: err.msg})
    }
    next(err)
})

app.use((err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(400).send({status:400, msg: 'Invalid parameter'})
    }
    next(err)
})

app.use((err, request, response, next) => {
    if (err.code === '23503') {
        response.status(400).send({status:400, msg: 'Bad request'})
    }
    next(err)
})

module.exports = app