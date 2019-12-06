/** 
 * This file connects to the remote Prisma database and 
 * gives us the ability to query it with JavaScript
 */

const { Prisma } = require('prisma-binding');

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
})

module.exports = db;