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
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then((data) => {
        const { rows } = data
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg:'ID does\'nt exist'})
        } else {
            return rows[0]
        }
    })
}

const selectArticles = () => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`).then((result) => {
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
    const votes = 0
    const createdAt = new Date()
    const valuesArr = [Number(article_id), username, body, votes, createdAt]
    return db.query(format(`INSERT INTO comments (article_id, author, body, votes, created_at) VALUES %L RETURNING *`, [valuesArr])).then((data) => {
        const {rows} = data
        return rows[0]
    })
}

module.exports = {
    selectTopics,
    selectArticleByID,
    selectArticles,
    selectCommentsByArticleID,
    insertCommentByArticleID
}