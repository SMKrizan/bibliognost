// imports GraphQL tagged template function; an advanced use of template literals introduced w ES6
const { gql } = require('apollo-server-express');

// creates typeDefs variables for use within tagged template fn; e.g. <type Query {}> is a data type built into GraphQL, i.e. a 'scalar'; included inside each variables is a custom data type and a definition
const typeDefs = gql`

input Author {
    authors: String
}

type Book {
    bookId: String!
    description: String!
    title: String!  
    image: String
    link: String
}

type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}

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

type Auth {
    token: ID!
    user: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth  
    saveBook(input: bookList): User
    removeBook(input: bookList): User
}

`;


module.exports = typeDefs;
