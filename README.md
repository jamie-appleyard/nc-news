# Northcoders News API

## About this project
- This project was built during the Northcoders bootcamp over the space of 5 days.
- This is an example backend API for a news website built using express and postgres
- You can interact with a live version of the API at this link https://nc-news-ow7l.onrender.com/api
- This link will take you to a list of endpoints, use each one in the search bar to see different data returned
- The live version is currently deployed using Render and ElephantSQL
- This repo can be cloned and run locally for testing
- The repo was built using full TDD

## To clone and run this repo locally
- Git clone https://github.com/jamie-appleyard/nc-news.git
- Create .env.test file at root level
    - Add PGDATABASE=nc_news_test
- Create .env.development file at root level
    - Add PGDATABASE=nc_news
- See .env-example for an example of .env.* file setup
- Run ```npm install``` in the terminal when in the root directory
- Run ```npm setup-dbs``` to create databases
- By running ```npm test``` this will seed the test database automatically, you will see all tests are currently passing
- To seed the development database run ```npm run-seed```
- You should now be able to interact with the databases using ```psql``` in the terminal 
- Any additions to this repo should be paired with full tests, unless you remove dependency husky as it will run tests automatically before commiting, any failures will disallow a commit

## Version requirements
- Node >= 21.5.0
- psql >= 14.10

## Dependencies
- express
- dotenv
- husky
- pg
- pg-format

### You must have postgres installed on your machine and open to run this repo locally 
- https://postgresapp.com/

