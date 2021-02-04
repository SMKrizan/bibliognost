// imports GraphQL tagged template function; an advanced use of template literals introduced w ES6
const { gql } = require('apollo-server-express');

// creates typeDefs variables for use within tagged template fn; e.g. <type Query {}> is a data type built into GraphQL, i.e. a 'scalar'; included inside each variables is a custom data type and a definition
const typeDefs = gql`

type Query {
    me: User
}

input bookList {
    description: String!
    title: String!
    bookId: String!
    image: String
    link: String
    authors: [Author]
}

type Mutation {
    login: (email: String!, password: String!): Auth  
    addUser: (username: String!, email: String!, password: String!): Auth
    saveBook: (input: bookList): User
    removeBook: (bookId: String!): User
}

type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String!
    description: String!
    title: String!
    image: String
    link: String
    authors: [Author]
}

type Auth {
    token: ID!
    user: User
}

`;


module.exports = typeDefs;
