const db = require('../db/connection.js')
const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const app = require('../app.js')
const api_endpoints = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end())

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
            expect(article).toMatchObject({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    });
    test('GET 400: returns an appropriate status and message when passed a valid id that does not exist', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('ID does\'nt exist')
        })
    });
    test('GET 404: returns appropriate status and message when given an invalid ID as a parameter', () => {
        return request(app)
        .get('/api/articles/myarticle')
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('Invalid ID parameter')
        })
    })
});

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

describe('/api/tropics', () => {
    test('GET 404: returns an appropriate status when an invalid URL is entered', () => {
        return request(app)
        .get('/api/tropics')
        .expect(404)
    })
})