const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  registerUserService,
  findUserByObjectOfParameters,
  findUserByIdService,
  updateUserByIdService,
} = require('../services/users');

const registerController = async (req, res) => {
  try {
    const result = await registerUserService(req.body);

    const { email } = result;

    res.status(201).json({ email });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ code: 'api-register-error', message: 'Email in use' });
    }

    return res
      .status(400)
      .json({ code: 'api-register-error', message: error.message });
  }
};

const loginController = async (req, res) => {
  const { email: requestEmail, password: requestPassword } = req.body;

  try {
    const user = await findUserByObjectOfParameters({ email: requestEmail });

    if (!user) {
      throw new Error(`No user was found with Email: ${requestEmail}`);
    }

    const {
      _id,
      email: userEmail,
      password: userPassword,
      name,
      address,
      phone,
      birthday,
      avatarURL,
      favoriteNotices,
    } = user;

    const isUsersPasswordMatch = await bcrypt.compare(
      requestPassword,
      userPassword
    );

    if (!isUsersPasswordMatch) {
      throw new Error('Wrong password');
    }

    const token = jwt.sign({ _id }, process.env.JWT_SECRET);

    await updateUserByIdService(_id, { token });

    const result = {
      token,
      user: {
        email: userEmail,
        name,
        address,
        phone,
        birthday,
        avatarURL,
        favoriteNotices,
      },
    };

    res.json(result);
  } catch (error) {
    return res
      .status(401)
      .json({ code: 'api-login-error', message: error.message });
  }
};

const refreshController = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await findUserByIdService(_id);

    if (!user) {
      throw new Error(`No user was found with ID: ${_id}`);
    }

    const {
      email,
      name,
      address,
      phone,
      birthday,
      avatarURL,
      favoriteNotices,
    } = user;

    const result = {
      email,
      name,
      address,
      phone,
      birthday,
      avatarURL,
      favoriteNotices,
    };

    res.json(result);
  } catch (error) {
    return res
      .status(400)
      .json({ code: 'api-refresh-error', message: error.message });
  }
};

const logoutController = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await findUserByIdService(_id);

    if (!user) {
      throw new Error(`No user was found with ID: ${_id}`);
    }

    await updateUserByIdService(user._id, { token: null });

    res.status(204).json({});
  } catch (error) {
    return res
      .status(400)
      .json({ code: 'api-logout-error', message: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
