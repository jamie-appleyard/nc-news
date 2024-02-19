const {
    selectTopics
} = require('../models/nc_news_models.js')

const getTopics = (req, res, next) => {
    selectTopics().then((rows) => {
        res.status(200).send({status:200, rows: rows})
    })
}

module.exports = {
    getTopics
}