const db = require('../db/connection.js')
const format = require('pg-format')

const selectTopics = () => {
    const queryString = `SELECT * FROM topics`
    return db.query(queryString).then((data) => {
        const {rows} = data
        return rows
    })
}

const selectArticleByID = (id) => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`, [id]).then((data) => {
        const { rows } = data
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg:'ID does\'nt exist'})
        } else {
            return rows[0]
        }
    })
}

const selectArticles = (query) => {
    const validQueries = ['topic', 'sort_by', 'order']
    let invalidQuery = false
    Object.keys(query).forEach((key) => {
        if (!validQueries.includes(key)) {
            invalidQuery = true;
        }
    })

    if (invalidQuery) {
        return Promise.reject({status:400, msg:'Bad request'})
    }

    let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`

    if (query.topic) {
        const { topic } = query
        const validTopics = ['mitch', 'cats', 'paper']
        if (validTopics.includes(topic)) {
            queryString += ` WHERE articles.topic = '${topic}'`
        } else {
            return Promise.reject({status:400, msg:'Bad request'})
        }
    }

    queryString += ` GROUP BY articles.article_id`

    if (query.sort_by) {
        const { sort_by } = query
        const validSortBy = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
        if (validSortBy.includes(sort_by)) {
            queryString += ` ORDER BY articles.${ sort_by }`
        } else {
            return Promise.reject({status:400, msg:'Bad request'})
        }
    } else {
        queryString += ` ORDER BY articles.created_at`
    }

    if (query.order) {
        const { order } = query
        const validOrder = ['ASC', 'DESC']
        if (validOrder.includes(order)) {
            queryString += ` ${order}`
        } else {
            return Promise.reject({status:400, msg:'Bad request'})
        }
    } else {
        queryString += ' DESC'
    }

    return db.query(queryString).then((result) => {
        return result.rows
    })
}

const selectCommentsByArticleID = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC', [article_id]).then((data) => {
        const {rows} = data
        return rows
    })
}

const insertCommentByArticleID = (article_id, {username, body}) => {
    if (!article_id || !username || !body) {
        return Promise.reject({status:400, msg: 'Bad request'})
    }
    const valuesArr = [Number(article_id), username, body]
    return db.query(format(`INSERT INTO comments (article_id, author, body) VALUES %L RETURNING *`, [valuesArr])).then((data) => {
        const {rows} = data
        return rows[0]
    })
}


const deleteCommentByID = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`, [comment_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status:404, msg:'ID does\'nt exist'})
        }
    })
}


const updateArticleByID = (article_id, { inc_votes }) => {
    if (!inc_votes) {
        return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]).then((data) => {
            const { rows } = data
            return rows[0]
        })
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id]).then((data) => {
        const { rows } = data
        return rows[0]
    })
}

const selectAllUsers = () => {
    return db.query(`SELECT * FROM users`).then((data) => {
        const { rows } = data
        return rows
    })
}

const selectUserByUsername = (params) => {
    const { username } = params
    return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then((data) => {
        const { rows } = data
        if (rows.length === 0) {
            return Promise.reject({status:404, msg:'ID does\'nt exist'})
        }
        return rows[0]
    })
}

const updateCommentByID = (comment_id, body) => {
    const { inc_votes } = body
    if (!inc_votes) {
        return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id]).then((data) => {
            const { rows } = data
            if (rows.length === 0) {
                return Promise.reject({status:404, msg:'ID does\'nt exist'})
            }
            return rows[0]
        })
    }
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [inc_votes, comment_id]).then((data) => {
        const { rows } = data
        if (rows.length === 0) {
            return Promise.reject({status:404, msg:'ID does\'nt exist'})
        }
        return rows[0]
    })
}

const insertArticle = (body) => {
    const newArticle = body
    if (!newArticle.title || !newArticle.topic || !newArticle.author || ! newArticle.body) {
        return Promise.reject({status:400, msg:'Bad request'})
    }
    if (!newArticle.article_img_url) {
        newArticle.article_img_url = 'user.icon'
    }
    newArticle.votes = 0
    newArticle.created_at = new Date()
    const valuesArray = [[newArticle.title, newArticle.topic, newArticle.author, newArticle.body, newArticle.created_at, newArticle.votes, newArticle.article_img_url]]
    return db.query(format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, valuesArray)).then((data) => {
        const { rows } = data
        rows[0].comment_count = 0
        return rows[0]
    })
}

const insertTopic = (body) => {
    const { slug } = body
    const { description } = body
    if (!slug || !description ) {
        return Promise.reject({status:400, msg:'Bad request'})
    }
    return db.query(format(`INSERT INTO topics (slug, description) VALUES %L RETURNING *`, [[slug, description]])).then((data) => {
        const { rows } = data
        return rows[0]
    })
}

module.exports = {
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
}