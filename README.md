## RoyalTeeJ-nc-articles

link to hosted version:

https://royalteej-be-nc-news.onrender.com

## Project Summary

This project is a RESTful API built with Node.js, Jest and PostgreSQL that allows users to interact with news articles, topics, and comments. It supports features such as retrieving articles by topic, upvoting/downvoting articles, posting and deleting comments, and more.

The API is designed for developers to integrate or expand on and it includes endpoints for topics, articles, comments, and users. It is fully tested with Jest and uses environment variables to securely store sensitive data such as database credentials.

## Features

- Retrieve articles by topic or sort by various fields (created_at, title, votes, etc.)
- Upvote or downvote articles
- Post, retrieve, and delete comments on articles
- Manage users and topics
- Fully tested with Jest
- Comprehensive error handling and status codes.

## Setup Instructions

**Step 1:** After cloning the repo, create three `.env` files in the root of the project:

1. `.env.development`
2. `.env.test`
3. `.env.production`

In the files, add the following line, adjusting for the correct database name:

1. PGDATABASE=your_database_name_here
2. PGDATABASE=your_database_name_here + \_test
3. DATABASE_URL=your_hosting_transaction_pooler_url_here

You can find the database names in the db/setup.sql file which is where you will also be creating your database.

**Step 2:** Run the following command to install all the necessary dependencies:

- npm install

**Step 3:** Run the following command to set up the required tables and structure in your database:

- npm run setup-dbs

**Step 4:** Once the environment files are configured, and the dependencies are installed, seed your local development database by running:

- npm run seed

**Step 5:** Now that everything is set up, start the server with:

- npm run start

Your server will run on http://localhost:9080 for local development.

**(optional recommended step) Step 6:** To run tests for the project, use:

- npm run test

Once these steps are completed you should be able to connect to the database and run the project.

## Available scripts

- "start": "node listen.js",
- "seed-prod": "NODE_ENV=production npm run seed",
- "setup-dbs": "psql -f ./db/setup.sql",
- "seed": "node ./db/seeds/run-seed.js",
- "test": "NODE_ENV=test jest",
- "prepare": "husky install"

Can also be seen in package.json

## Endpoints

- GET /api/topics: Get all topics.
- GET /api/articles/:article_id: Get a specific article by ID.
- GET /api/articles: Get a list of articles.
- PATCH /api/articles/:article_id: Update the vote count for an article.
- GET /api/articles/:article_id/comments: Get comments for a specific article.
- POST /api/articles/:article_id/comments: Post a comment on an article.
- DELETE /api/comments/:comment_id: Delete a comment by ID.
- GET /api/users: Get a list of all users.

More details on this in endpoints.json file

## Minimum Requirements

- Node.js: v14.0.0 or higher
- PostgreSQL: v12.0 or higher
- Jest: v27.5.1 or higher
