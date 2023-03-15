const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
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
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      console.log(token);
      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      console.log(context.user, "saved book mutation")
      if (context.user) {
        const updateUser = User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: { savedBooks: args.book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return updateUser;
      }

    },

    removeUser: async (parent, { UserId }) => {
      return User.findOneAndDelete({ _id: UserId });
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (
        context.user
      ) {
        return User.findOneAndUpdate(
          { _id: context.user._id},
          { $pull: { savedBooks: {bookId} } },
          { new: true }
        );
      }
    },
  },
};

module.exports = resolvers;



