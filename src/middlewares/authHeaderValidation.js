const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findUserById } = require('../services/users');

const authHeaderValidation = async (req, res, next) => {
  const authHeader = req.header('authorization');

  try {
    if (!authHeader) {
      throw new Error('token-no-token');
    }

    const [tokenType, token] = authHeader.split(' ');

    if (!tokenType || tokenType !== 'Bearer') {
      throw new Error('token-invalid');
    }

    if (!token) {
      throw new Error('token-invalid');
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(_id);

    if (!user) {
      throw new Error('token-no-user');
    }

    if (!user.token.includes(token)) {
      throw new Error('token-invalid');
    }

    req.user = user;
    req.currentToken = token;
  } catch (error) {
    return res.status(401).json({
      code: error.message,
    });
  }

  next();
};

module.exports = authHeaderValidation;
