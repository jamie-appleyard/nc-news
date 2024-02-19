const api_endpoints = require('../endpoints.json')

const {
    selectTopics
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

module.exports = {
    getTopics,
    getEndpoints
}