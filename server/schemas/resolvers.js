const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get user by username or id (mongoDB always includes the '_id' field unless it is specifically excluded)
        user: async (parent, { username }) => {
            const foundUser = await User.findOne({ username })
                .select('-__v -password');

            if (!foundUser) {
                throw new AuthenticationError('Unable to find this user.');
            }

            return user;
        },
    },

    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            if (!user) {
                throw new AuthenticationError('Something went wrong with this request.')
            }

            return { token, user };
        },

        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials. Please try again.');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials. Please try again.')
            }

            const token = signToken(user);
            return { token, user };
        },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (parent, { bookId }, context) => {
            console.log('user: ', user)
            // IMPLEMENT THIS AS A TRY/CATCH?
            if (context.user) {
                const updateUserBooks = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookId } },
                    // recall: without the following statement Mongo will return the original instead of updated document
                    { new: true }
                ).populate('savedBooks')

                return updateUserBooks;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        // remove a book from `savedBooks`
        removeBook: async (parent, { bookId }, context) => {

        }
    }
};

module.exports = resolvers; 