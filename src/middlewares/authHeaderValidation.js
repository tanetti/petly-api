const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findUserByIdService } = require('../services/users');

const authHeaderValidation = async (req, res, next) => {
  const authHeader = req.header('authorization');

  try {
    if (!authHeader) {
      throw new Error('Please provide an authorization header');
    }

    const [tokenType, token] = authHeader.split(' ');

    if (!tokenType || tokenType !== 'Bearer') {
      throw new Error('Authorization token type invalid');
    }
    if (!token) {
      throw new Error('Please provide a valid authorization token');
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserByIdService(_id);

    if (!user) {
      throw new Error(`No user with ID: "${_id}" was found`);
    }

    if (user.token !== token) {
      throw new Error('Invalid authorization token');
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({
      code: 'api-authorization-error',
      message: error.message,
    });
  }

  next();
};

module.exports = authHeaderValidation;
