const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// imports middleware that ensures every request performs an authentication check
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
// creates new Apollo server, passing in schema data; once connected, a '/graphql' endpoint is created for Express.js server to serve as main endpoint for accessing API
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // sets 'context' method which returns what will be made available to resolvers; on resolvers side, these headers become 'context' parameter
  context: authMiddleware
});

// integrates Apollo server with Express applications as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// responds with production-ready React front-end code for GET request made to any location on server without explicitly defining a route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // logs location for testing GraphQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
