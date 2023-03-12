const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    authors: [String]
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String!
  }

  # Set up an Auth type to handle returning data from a user creating or user login
  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String! 
  }

  type Query {
    me: User
  }

  type Mutation {
   
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    saveBook(book: BookInput!): User
    removeUser(userId: ID!): User
    deleteBook(userId: ID!, book: String!): User
  }
`;

module.exports = typeDefs;
