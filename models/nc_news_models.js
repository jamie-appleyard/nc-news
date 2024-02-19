const db = require('../db/connection.js')

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

module.exports = {
    selectTopics,
    selectArticleByID
}