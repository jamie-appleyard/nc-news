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