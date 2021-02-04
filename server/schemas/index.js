// import resolvers from './resolvers.js';
// import typeDefs from './typeDefs.js';

// export default { resolvers, typeDefs }

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = { typeDefs, resolvers };