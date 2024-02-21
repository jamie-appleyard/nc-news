const api_endpoints = require('../endpoints.json')

const {
    selectTopics,
    selectArticleByID,
    selectArticles,
    selectCommentsByArticleID,
    insertCommentByArticleID,
    updateArticleByID,
    selectAllUsers
} = require('../models/nc_news_models.js')

const getEndpoints = (req, res, next) => {
    const endpoints = api_endpoints
    res.status(200).send({endpoints: endpoints})
}

const getTopics = (req, res, next) => {
    selectTopics().then((rows) => {
        res.status(200).send({topics: rows})
    }).catch((err) => {
        next(err)
    })
}

const getArticleByID = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByID( article_id ).then((article) => {
        res.status(200).send({ article: article })
    }).catch((err) => {
        next(err)
    })
}

const getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

const getCommentsByArticleID = (req, res, next) => {
    const { article_id } = req.params
    Promise.all([selectArticleByID(article_id), selectCommentsByArticleID(article_id)])
    .then((promiseArr) => {
        res.status(200).send({ comments : promiseArr[1]})
    }).catch((err) => {
        next(err)
    })
}

const postCommentByArticleID = (req, res, next) => {
    const { article_id } = req.params
    Promise.all([selectArticleByID(article_id), insertCommentByArticleID(article_id, req.body)])
    .then((promiseArr) => {
        res.status(201).send({ comment : promiseArr[1] })
    }).catch((err) => {
        next(err)
    })
}

const patchArticleByID = (req, res, next) => {
    const { article_id } = req.params
    Promise.all([selectArticleByID(article_id), updateArticleByID(article_id, req.body)])
    .then((promiseArr) => {
        res.status(200).send({ article : promiseArr[1] })
    }).catch((err) => {
        next(err)
    })
}

const getAllUsers = (req, res, next) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users })
    })
}

module.exports = {
    getTopics,
    getEndpoints,
    getArticleByID,
    getArticles,
    getCommentsByArticleID,
    postCommentByArticleID,
    patchArticleByID,
    getAllUsers
}