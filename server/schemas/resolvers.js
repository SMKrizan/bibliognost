const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get user by username or id (mongoDB always includes the '_id' field unless it is specifically excluded)
        me: async (parent, args, context) => {
            if (context.user) {
                console.log(context.user)
                const userData = await  User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks')
    
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, args) => {
            try {
                var user = await User.create(args);
                var token = signToken(user);

            } catch(err) {
                console.log("error: ", err)
            }

            console.log('token&user', token, user)
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
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const bookstats = { 
                    bookId: args.bookId, 
                    description: args.description, 
                    title: args.title, 
                    authors: args.authors,
                    image: args.image,
                    link: args.link
              }
                const updateUserBooks = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookstats } },
                    // recall: w/out 'new: true' Mongo will return the original instead of updated document
                    { new: true }
                ).populate('savedBooks')

                return updateUserBooks;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        // remove a book from `savedBooks`
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                ).populate('savedBooks')

                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in.");
        }
    }
};

module.exports = resolvers; 