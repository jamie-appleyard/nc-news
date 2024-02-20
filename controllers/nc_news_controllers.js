const api_endpoints = require('../endpoints.json')

const {
    selectTopics,
    selectArticleByID,
    selectArticles
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

module.exports = {
    getTopics,
    getEndpoints,
    getArticleByID,
    getArticles
}