const db = require('../db/connection.js')
const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const app = require('../app.js')

beforeEach(() => seed(data));
afterAll(() => db.end())

describe('/api/topics', () => {
    test('GET 200: should return an array of all topics objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const rows = response.body.rows
            expect(rows).toHaveLength(3)
            rows.forEach((row) => {
                expect(row).toMatchObject({
                    slug : expect.any(String),
                    description : expect.any(String)
                })
            })
        });
    })
    test('GET 404: returns an appropriate status and message when an invalid URL is entered', () => {
        return request(app)
        .get('/api/tropics')
        .expect(404)
    })
});