const {
    selectTopics
} = require('../models/nc_news_models.js')

const getTopics = (req, res, next) => {
    selectTopics().then((rows) => {
        res.status(200).send({topics: rows})
    })
}

module.exports = {
    getTopics
}