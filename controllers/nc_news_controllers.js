const api_endpoints = require('../endpoints.json')

const {
    selectTopics,
    selectArticleByID,
    selectArticles,
    selectCommentsByArticleID,
    insertCommentByArticleID,
    deleteCommentByID,
    updateArticleByID,
    selectAllUsers,
    selectUserByUsername,
    updateCommentByID,
    insertArticle,
    insertTopic
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
    selectArticles(req.query).then((articles) => {
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


const deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    deleteCommentByID(comment_id).then(() => {
        res.status(204).send()
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
    }).catch((err) => {
        next(err)
    })
}

const getUserByUsername = (req, res, next) => {
    selectUserByUsername(req.params).then((user) => {
        res.status(200).send({ user })
    }).catch((err) => {
        next(err)
    })
}

const patchCommentByID = (req, res, next) => {
    const { comment_id } = req.params
    updateCommentByID(comment_id, req.body).then((comment) => {
        res.status(200).send({ comment })
    }).catch((err) => {
        next(err)
    })
}

const postArticle = (req, res, next) => {
    insertArticle(req.body).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

const postTopic = (req, res, next) => {
    insertTopic(req.body).then((topic) => {
        res.status(200).send({ topic })
    }).catch((err) => {
        next(err)
    })
}

module.exports = {
    getTopics,
    getEndpoints,
    getArticleByID,
    getArticles,
    getCommentsByArticleID,
    postCommentByArticleID,
    deleteComment,
    patchArticleByID,
    getAllUsers,
    getUserByUsername,
    patchCommentByID,
    postArticle,
    postTopic
}