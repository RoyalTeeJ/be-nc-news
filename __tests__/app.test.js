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

  test("GET: 200 should return an article object with comment_count when fetch by article_id", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id");
        expect(body.article.article_id).toBe(1);
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
        expect(body.article).toHaveProperty("comment_count");
        expect(typeof body.article.comment_count).toBe("number");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET: 200 should return an array of articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.length).toBe(10);
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

  describe("GET /api/articles?queries", () => {
    test("GET: 200 should return articles sorted by votes in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0].votes).toBe(0);
          expect(body.article).toBeSorted({ key: "votes", ascending: true });
        });
    });

    test("GET: 200 should return articles sorted by title in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0].title).toBe("Z");
          expect(body.article).toBeSorted({ key: "title", descending: true });
        });
    });

    test("GET: 200 should return articles sorted by title in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toBeSorted({
            key: "comment_count",
            descending: true,
          });
        });
    });

    test("GET: 400 should return 400 for invalid sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_column")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Invalid sort column");
        });
    });

    test("GET: 400 should return 400 for invalid order", () => {
      return request(app)
        .get("/api/articles?order=invalid_order")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Invalid order");
        });
    });

    test("GET: 200 should return articles filtered by topic 'mitch'", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).toBe(10);
          body.article.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("GET: 200 should return articles filtered by topic 'cats'", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).toBe(1);
          body.article.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });

    test("GET: 200 should return articles filtered by topic 'paper'", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          body.article.forEach((article) => {
            expect(article.topic).toBe("paper");
          });
        });
    });

    test("GET: 400 should return 400 for invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=invalid_topic")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Invalid topic");
        });
    });
  });

  describe("GET /api/articles(pagination)", () => {
    test("GET: 200 should return a paginated list of articles with default limit (10) and page (1)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveLength(10);
          body.article.forEach((articles) => {
            expect(articles).toHaveProperty("total_count");
            expect(typeof articles.total_count).toBe("number");
          });
        });
    });

    test("GET: 200 should return a paginated list of articles with custom limit and page", () => {
      return request(app)
        .get("/api/articles")
        .query({ limit: 3, page: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveLength(3);
          body.article.forEach((articles) => {
            expect(articles).toHaveProperty("total_count");
            expect(articles.total_count).toBeGreaterThanOrEqual(3);
          });
        });
    });

    test("GET: 200 should return articles filtered by topic", () => {
      return request(app)
        .get("/api/articles")
        .query({ topic: "mitch", limit: 5, page: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveLength(5);
        });
    });

    test("GET: 400 should return 400 for invalid page number", () => {
      return request(app)
        .get("/api/articles")
        .query({ page: -1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid query parameters");
        });
    });

    test("GET: 400 should return 400 for invalid limit", () => {
      return request(app)
        .get("/api/articles")
        .query({ limit: "invalid" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid query parameters");
        });
    });

    test("GET: 400 should return 400 for invalid topic", () => {
      return request(app)
        .get("/api/articles")
        .query({ topic: "nonexistent_topic", limit: 5, page: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid topic");
        });
    });

    test("GET: 200 should return articles sorted by votes in ascending order", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "votes", order: "ASC", limit: 5, page: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toBeInstanceOf(Array);
          expect(body.article).toHaveLength(5);
          expect(body.article).toBeSorted({ key: "votes", ascending: true });
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
        expect(body.comments.length).toBe(10);
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
  describe("GET /api/articles/:article_id/comments (pagination)", () => {
    test("GET: 200 should return paginated comments for a specific article", () => {
      return request(app)
        .get(`/api/articles/1/comments?limit=5&page=1`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments.length).toBeLessThanOrEqual(5);
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("total_count");
          });
        });
    });

    test("GET: 400 should return 400 if invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid_id/comments?limit=5&page=1")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request");
        });
    });

    test("GET: 404 should return 404 if no comments exist for a given article", () => {
      return request(app)
        .get("/api/articles/9999/comments?limit=5&page=1")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not Found");
        });
    });

    test("GET: 400 should return 400 if invalid query parameters", () => {
      return request(app)
        .get(`/api/articles/1/comments?limit=abc&page=1`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid query parameters");
        });
    });
    test("GET: 400 should return 400 for invalid limit", () => {
      return request(app)
        .get(`/api/articles/1/comments?limit=5&page= -1`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid query parameters");
        });
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

describe("GET /api/users/:username", () => {
  test("GET: 200 should return a user object when the username is found", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("butter_bridge");
        expect(body.user).toHaveProperty("username");
        expect(body.user).toHaveProperty("name");
        expect(body.user).toHaveProperty("avatar_url");
      });
  });

  test("GET: 404 should return an error when the user is not found", () => {
    return request(app)
      .get("/api/users/nonexistentuser")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: "User not found" });
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("should update the votes of a comment by the given vote increment", () => {
    const newVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment.comment_id).toBe(1);
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment.votes).toBeGreaterThan(0);
      });
  });

  test("should return a 400 error when the body does not contain inc_votes", () => {
    const newVote = {};

    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "inc_votes is required" });
      });
  });

  test("should return a 404 error when the comment_id is invalid (does not exist)", () => {
    const newVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/comments/99999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Comment not found" });
      });
  });

  test("should return a 400 error when inc_votes is not a number", () => {
    const newVote = { inc_votes: "invalid" };

    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          message: "inc_votes must be a number",
        });
      });
  });

  test("PATCH: 400 should return 400 if article_id is not a number", () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch("/api/comments/banana")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles", () => {
  test("POST: 201 should create a new article", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "New Trends in Node.js",
      body: "This article discusses the latest trends in Node.js development.",
      topic: "cats",
      article_img_url:
        "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("author", "butter_bridge");
        expect(body.article).toHaveProperty("title", "New Trends in Node.js");
        expect(body.article).toHaveProperty(
          "body",
          "This article discusses the latest trends in Node.js development."
        );
        expect(body.article).toHaveProperty("votes", 0);
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("comment_count", 0);
        expect(body.article).toHaveProperty(
          "article_img_url",
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
        );
      });
  });

  test("POST: 400 should return 400 if required fields are missing", () => {
    const newArticle = {
      author: "butter_bridge",
      body: "This article discusses the latest trends in Node.js development.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Bad Request - author, title, body, and topic are required"
        );
      });
  });

  test("POST: 400 should return 404 if the topic does not exist", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "New Trends in Node.js",
      body: "This article discusses the latest trends in Node.js development.",
      topic: "nonexistent_topic",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });

  test("POST: 201 should create a new article with the default image URL if not provided", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "New Trends in Node.js",
      body: "This article discusses the latest trends in Node.js development.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_img_url");
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
      });
  });

  test("POST: 400 should return 404 if the author does not exist", () => {
    const newArticle = {
      author: "nonexistantAuthor",
      title: "New Trends in Node.js",
      body: "This article discusses the latest trends in Node.js development.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});

describe("POST /api/topics", () => {
  test("POST: 201 should create a new topic", () => {
    const newTopic = {
      slug: "technology",
      description: "All things related to technology",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toHaveProperty("slug", "technology");
        expect(body.topic).toHaveProperty(
          "description",
          "All things related to technology"
        );
      });
  });

  test("POST: 400 should return error when slug is missing", () => {
    const newTopic = { description: "All things related to technology" };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Bad Request - slug and description are required"
        );
      });
  });

  test("POST: 400 should return error when description is missing", () => {
    const newTopic = { slug: "technology" };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Bad Request - slug and description are required"
        );
      });
  });

  test("POST: 409 should return error when topic with same slug already exists", () => {
    const newTopic = {
      slug: "cats",
      description: "All things related to cats",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(409)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Conflict - Topic with this slug already exists"
        );
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("DELETE: 204 should delete the article and return status 204 with no content, and comments should also be deleted", () => {
    return request(app)
      .delete(`/api/articles/1`)
      .expect(204)
      .then(() => {
        return request(app)
          .get(`/api/articles/1/comments`)
          .expect(404)
          .then((response) => {
            expect(response.body.message).toBe("Not Found");
          });
      });
  });

  test("DELETE: 404 should return 404 if article_id does not exist", () => {
    return request(app)
      .delete(`/api/articles/9999`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found");
      });
  });

  test("DELETE: 400 should return 400 if article_id is not a number", () => {
    return request(app)
      .delete("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
