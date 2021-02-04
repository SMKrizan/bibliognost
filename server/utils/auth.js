const jwt = require('jsonwebtoken');
require('dotenv').config()

const secret = `${process.env.SECRET}`;
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows enables token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separates ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // if no token, returns message and request object as-is
    if (!token) {
      res.status(400).json({ message: 'You have no token!' });
      return req;
    }

    // verifies and gets user data from token
    try {
      // decodes and attaches user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // returns updated request object
    return req;
  },

  // expects user object
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
