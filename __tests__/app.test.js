const endpointsJson = require("../endpoints.json");
const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

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
  test("404: should return a 404 error if endpoint is not found", () => {
    return request(app)
      .get("/api/nope")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("should return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return an article object by its ID", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
      });
  });

  test("should return 400 if article_id is invalid non-numeric", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });

  test("should return 404 if the article is not found", () => {
    return request(app)
      .get(`/api/articles/9999`)
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe(`Not Found`);
      });
  });
});

describe("GET /api/articles", () => {
  test("GET: 200 should return an array of articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.length).toBe(5);
        expect(Array.isArray(body.article)).toBe(true);
        body.article.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });

  test("GET: 200 articles should not return with a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.article.forEach((article) => {
          expect(article.body).toBeUndefined;
        });
      });
  });

  test("GET: 200 should return articles sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET: 200 should return an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        expect(Array.isArray(body.comments)).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });

  test("GET: 200 should return comments sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("GET: 404 should return 404 if no comments exist for a given article", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("GET: 400 should return 400 if article_id is invalid non-numeric", () => {
    return request(app)
      .get("/api/articles/randomWord/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 should add a comment to the given article and return the posted comment with the correct values", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is what i live for",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(0);
        expect(body.comment.article_id).toBe(1);
        expect(newComment.username).toEqual(body.comment.author);
        expect(newComment.body).toEqual(body.comment.body);
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment).toHaveProperty("created_at");
        expect(body.comment).toHaveProperty("author");
        expect(body.comment).toHaveProperty("body");
        expect(body.comment).toHaveProperty("article_id");
      });
  });

  test("POST: 400 should return 400 if username or body is missing", () => {
    const newComment = { username: "butter_bridge" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("POST: 400 should return 400 if article_id is non-numeric", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is what i live for",
    };

    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("POST: 404 should return 404 if article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is what i live for",
    };

    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });

  test("POST: 404 should return 404 if username does not exist", () => {
    const newComment = {
      username: "nonexistentuser",
      body: "This is what i live for",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH: 200 should update the article's votes and return the updated article", () => {
    const newVote = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.addedVotes.article_id).toBe(1);
        expect(body.addedVotes.votes).toBeGreaterThan(0);
        expect(body.addedVotes).toHaveProperty("article_id");
        expect(body.addedVotes).toHaveProperty("title");
        expect(body.addedVotes).toHaveProperty("author");
        expect(body.addedVotes).toHaveProperty("body");
        expect(body.addedVotes).toHaveProperty("topic");
        expect(body.addedVotes).toHaveProperty("created_at");
        expect(body.addedVotes).toHaveProperty("votes");
        expect(body.addedVotes).toHaveProperty("article_img_url");
      });
  });

  test("PATCH: 400 should return 400 if inc_votes is not a number", () => {
    const invalidVote = { inc_votes: "not_a_number" };

    return request(app)
      .patch("/api/articles/1")
      .send(invalidVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH: 404 should return 404 if article_id does not exist", () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/9999")
      .send(newVote)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article Not Found");
      });
  });

  test("PATCH: 400 should return 400 if article_id is not a number", () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/banana")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH: 400 should return 400 if the body is missing", () => {
    const newVote = {};

    return request(app)
      .patch("/api/articles/banana")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 should delete the comment given by id and return status 204 with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE: 404 should return 404 if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Comment Not Found");
      });
  });

  test("DELETE: 400 should return 400 if comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET: 200 should return an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
