const Notice = require('../models/notices');
const User = require('../models/user');
const HttpError = require('../helpers/HttpError');
const path = require('path');
const fs = require('fs/promises');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

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
      return res.status(409).json({ code: 'register-email-0102-error' });
    }

    return res.status(400).json({ code: error.message });
  }
};

const loginController = async (req, res) => {
  const { email: requestEmail, password: requestPassword } = req.body;

  try {
    const user = await findUserByObjectOfParameters({ email: requestEmail });

    if (!user) {
      throw new Error('login-0100-error');
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
      throw new Error('login-0101-error');
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
    return res.status(401).json({ code: error.message });
  }
};

const refreshController = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await findUserByIdService(_id);

    if (!user) {
      throw new Error('refresh-no-user');
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
    return res.status(400).json({ code: error.message });
  }
};

const logoutController = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await findUserByIdService(_id);

    if (!user) {
      throw new Error('logout-no-user');
    }

    await updateUserByIdService(user._id, { token: null });

    res.status(204).json({});
  } catch (error) {
    return res.status(400).json({ code: error.message });
  }
};

const getCurrentController = async (req, res) => {
  const { email, name, address, phone, birthday, avatarURL, favoriteNotices } =
    req.user;

  const result = {
    user: {
      email,
      name,
      address,
      phone,
      birthday,
      avatarURL,
      favoriteNotices,
    },
  };

  res.status(200).json(result);
};

const getOwnController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 200 } = req.query;

    const skip = (page - 1) * limit;
    const result = await Notice.find({ owner: _id }, '', {
      skip,
      limit: Number(limit),
    }).populate('owner', '_id');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteController = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { noticeId } = req.params;

    const { favoriteNotices } = await User.findOne({
      _id: _id,
    });

    const newFavoriteNotices = !favoriteNotices.includes(noticeId)
      ? [...favoriteNotices, noticeId]
      : favoriteNotices;

    const result = await User.findByIdAndUpdate(
      { _id: _id },
      { favoriteNotices: newFavoriteNotices }
    );
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(newFavoriteNotices);
  } catch (error) {
    next(error);
  }
};

const getFavoriteController = async (req, res, next) => {
  try {
    const { page = 1, limit = 200 } = req.query;
    const { _id } = req.user;

    const { favoriteNotices } = await User.findOne({
      _id: _id,
    });

    const skip = (page - 1) * limit;
    const result = await Notice.find(
      { _id: favoriteNotices.map(noticeId => noticeId) },
      '',
      {
        skip,
        limit: Number(limit),
      }
    ).populate('owner', '_id email');

    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteFavoriteController = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { noticeId } = req.params;

    const { favoriteNotices } = await User.findOne({
      _id: _id,
    });

    const deletedIdIndex = favoriteNotices.findIndex(
      id => id === `${noticeId}`
    );

    favoriteNotices.splice(deletedIdIndex, 1);

    const result = await User.findByIdAndUpdate(
      { _id: _id },
      { favoriteNotices: favoriteNotices }
    );
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(favoriteNotices);
  } catch (error) {
    next(error);
  }
};

const updateAvatarController = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(avatarsDir, imageName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURl = path.join('public', 'avatars', imageName);
    await User.findByIdAndUpdate(id, { avatarURl }); // or create;
    res.json({ avatarURl });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getCurrentController,
  getOwnController,
  updateFavoriteController,
  getFavoriteController,
  deleteFavoriteController,
  updateAvatarController,
};
