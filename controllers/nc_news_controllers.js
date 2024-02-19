const api_endpoints = require('../endpoints.json')

const {
    selectTopics,
    selectArticleByID
} = require('../models/nc_news_models.js')

const getEndpoints = (req, res, next) => {
    const endpoints = api_endpoints
    res.status(200).send({endpoints: endpoints})
}

const getTopics = (req, res, next) => {
    selectTopics().then((rows) => {
        res.status(200).send({topics: rows})
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

module.exports = {
    getTopics,
    getEndpoints,
    getArticleByID
}