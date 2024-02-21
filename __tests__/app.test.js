const db = require('../db/connection.js')
const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const app = require('../app.js')
const api_endpoints = require('../endpoints.json')
require('jest-sorted')

beforeEach(() => seed(data));
afterAll(() => db.end())

describe('/api', () => {
    test('GET 200: returns a JSON object representing the the available endpoints of the API and their functionality', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((result) => {
            const {endpoints} = result.body
            expect(endpoints).toEqual(api_endpoints)
        })
    })
});

describe('/api/topics', () => {
    test('GET 200: should return an array of all topics objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const {topics} = response.body
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug : expect.any(String),
                    description : expect.any(String)
                })
            })
        });
    })
});

describe('/api/articles/:article_id', () => {
    test('GET 200: returns the article with the article_id given as a parameter in the URL', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const {article} = response.body
            expect(article.article_id).toBe(1)
            expect(article.comment_count).toBe(11)
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            })
        })
    });
    test('GET 404: returns an appropriate status and message when passed a valid id that does not exist', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('ID does\'nt exist')
        })
    });
    test('GET 400: returns appropriate status and message when given an invalid ID as a parameter', () => {
        return request(app)
        .get('/api/articles/myarticle')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Invalid parameter')
        })
    });
    test('PATCH 200: updates the value of votes by a given number when number is positive on an article with a matching article_id and returns matching article', () => {
        const patchObj = { inc_votes : 10 }
        return request(app)
        .patch('/api/articles/1')
        .send(patchObj)
        .expect(200)
        .then((response) => {
            const { article } = response.body
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
            expect(article.votes).toBe(110)
            expect(article.article_id).toBe(1)
        })
    });
    test('PATCH 200: updates the value of votes by a given number when number is negative on an article with a matching article_id and returns matching article', () => {
        const patchObj = { inc_votes : -50 }
        return request(app)
        .patch('/api/articles/1')
        .send(patchObj)
        .expect(200)
        .then((response) => {
            const { article } = response.body
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
            expect(article.votes).toBe(50)
            expect(article.article_id).toBe(1)
        })
    });
    test('PATCH 200: Respond with an uneditted article with matching article id if passed invalid patch object data', () => {
        const patchObj = { bad_data : 'I\'m bad data' }
        return request(app)
        .patch('/api/articles/1')
        .send(patchObj)
        .expect(200)
        .then((response) => {
            const { article } = response.body
            expect(article.article_id).toBe(1)
            expect(article.votes).toBe(100)
        })
    });
    test('PATCH 404: Respond with an appropriate status code and error message when passed a valid ID that does not exist', () => {
        const patchObj = { inc_votes : 10 }
        return request(app)
        .patch('/api/articles/99999')
        .send(patchObj)
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('ID does\'nt exist')
        })
    });
    test('PATCH 400: Respond with an appropriate status code and error message when passed an invalid ID', () => {
        const patchObj = { inc_votes : 10 }
        return request(app)
        .patch('/api/articles/myArticle')
        .send(patchObj)
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Invalid parameter')
        })
    });
    test('PATCH 400: Respond with an appropriate status code and error message when passed a patch object containing an invalid value', () => {
        const patchObj = { inc_votes : 'I am bad data' }
        return request(app)
        .patch('/api/articles/1')
        .send(patchObj)
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Invalid parameter')
        })
    });
});

describe('/api/articles', () => {
    test('GET 200: Returns an array of articles with a comment count column added', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const { articles } = response.body
            expect(articles).toHaveLength(13)
            expect(articles).toBeSorted({ key: 'created_at', descending: true})
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
                expect(article.hasOwnProperty('body')).toBe(false)
            })
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET 200: returns an array of all comments for the article with the given article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((result) => {
            const { comments } = result.body
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
                expect(comment.article_id).toBe(1)
            })
            expect(comments).toBeSorted({ key : 'created_at', descending : true })
        })
    });
    test('GET 200: Returns an empty array if passed a valid article_id with no associated comments', () => {
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then((result) => {
            const { comments } = result.body
            expect(comments).toHaveLength(0)
        })
    });
    test('GET 404: Returns an appropriate status and error message when passed a valid article ID that does not exist', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then((result) => {
            expect(result.body.status).toBe(404)
            expect(result.body.msg).toBe('ID does\'nt exist')
        })
    });
    test('GET 400: Returns an appropriate error message and status when passed an invalid article_id', () => {
        return request(app)
        .get('/api/articles/myarticle/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Invalid parameter')
        })
    });
    test('POST 200: Should add a new comment with the given article_id parameter and return the new row data', () => {
        const newComment = {
            username: 'lurker',
            body: 'Much WOW 0o0 ...'
        }
        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            const { comment } = response.body
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String)
            })
            expect(comment.author).toBe('lurker')
            expect(comment.body).toBe('Much WOW 0o0 ...')
            expect(comment.article_id).toBe(7)
        })
    });
    test('POST 400: Should respond with an appropriate status code and message when passed an invalid object', () => {
        const newComment = {
            body: 'Much WOW 0o0 ...'
        }
        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Bad request')
        })
    });
    test('POST 400: Should respond with an appropriate status code and message when passed an invalid username', () => {
        const newComment = {
            username: 'japple1996',
            body: 'Much WOW 0o0 ...'
        }
        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Bad request')
        })
    });
    test('POST 404: Should respond with an appropriate status code and message when passed an article ID that does not exist', () => {
        const newComment = {
            username: 'lurker',
            body: 'Much WOW 0o0 ...'
        }
        return request(app)
        .post('/api/articles/9999/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('ID does\'nt exist')
        })
    });
    test('POST 400: Should respond with an appropriate status code and message when passed an article ID that is invalid', () => {
        const newComment = {
            username: 'lurker',
            body: 'Much WOW 0o0 ...'
        }
        return request(app)
        .post('/api/articles/myArticle/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Invalid parameter')
        })
    });
});

describe('/api/comments/:comment_id', () => {
    test('DELETE 204: Deletes the comment with matching comment id', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });
    test('DELETE 404: Returns an appropriate status and message when passed a valid comment ID that does not exist', () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('ID does\'nt exist')
        })
    })
    test('DELETE 400: Returns an appropriate status and message when passed an invalid comment ID', () => {
        return request(app)
        .delete('/api/comments/myComment')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Invalid parameter')
        })
    })
});

describe('/api/users', () => {
    test('GET 200: Returns an array of all users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            const { users } = response.body
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    });
});

describe('/api/tropics', () => {
    test('GET 404: returns an appropriate status when an invalid URL is entered', () => {
        return request(app)
        .get('/api/tropics')
        .expect(404)
    })
})