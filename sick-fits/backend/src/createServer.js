const { GraphQLServer } = require('graphql-yoga');

// Resolvers
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');

// DB
const db = require('./db');

// Create the GraphQL yoga server
function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, db })
  });
}

module.exports = createServer;
