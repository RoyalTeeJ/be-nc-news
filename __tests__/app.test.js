const endpointsJson = require("../endpoints.json");
const app = require('../app.js')
const request = require('supertest')
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed'); 
const testData = require('../db/data/test-data/index.js')

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test('404: should return a 404 error if endpoint is not found', () => {
    return request(app)
    .get('/api/nope')
    .expect(404)
    .then((response)=>{
      expect(response.body.error).toBe('Endpoint not found')
    })
  });
});

describe('GET /api/topics', () => {
  test('should return an array of topic objects', () => {
      return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
              expect(Array.isArray(body)).toBe(true);
              body.forEach((topic) => {
                  expect(topic).toHaveProperty('slug');
                  expect(topic).toHaveProperty('description');
              });
          });
  });
})