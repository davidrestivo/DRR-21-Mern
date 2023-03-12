const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context ) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("not logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, User };
    },
    login: async (parent, { email, password }) => {
      const User = await User.findOne({ email });

      if (!User) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await User.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(User);
      console.log(token);
      return { token, User };
    },

    saveBook: async (parent, { UserId, book }) => {
      return User.findOneAndUpdate(
        { _id: UserId },
        {
          $addToSet: { books: book },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    removeUser: async (parent, { UserId }) => {
      return User.findOneAndDelete({ _id: UserId });
    },
    deleteBook: async (parent, { UserId, book }) => {
      return User.findOneAndUpdate(
        { _id: UserId },
        { $pull: { books: book } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
