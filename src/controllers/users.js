const Notice = require('../models/notices');
const User = require('../models/user');
const HttpError = require('../helpers/HttpError');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
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

    const { _id: userId, password: userPassword } = user;

    const isUsersPasswordMatch = await bcrypt.compare(
      requestPassword,
      userPassword
    );

    if (!isUsersPasswordMatch) {
      throw new Error('login-0101-error');
    }

    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);

    await updateUserByIdService(userId, { token });

    const result = { token, userId };

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

    const { _id: userId } = user;

    const result = { userId };

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

const getCurrentUserInfoController = async (req, res) => {
  const { email, name, address, phone, birthday, avatarURL } = req.user;

  const result = {
    email,
    name,
    address,
    phone,
    birthday,
    avatarURL,
  };

  res.json(result);
};

const updateCurrentUserInfoController = async (req, res) => {
  const { _id } = req.user;
  const body = req.body;

  await updateUserByIdService(_id, body);

  res.json({ code: 'user-info-update-success' });
};

const getOwnController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 200, search = '' } = req.query;

    const skip = (page - 1) * limit;
    const result = await Notice.find(
      {
        owner: _id,
        title: { $regex: `${search}` },
      },
      '',
      {
        skip,
        limit: Number(limit),
      }
    ).populate('owner', '_id');
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
    const { page = 1, limit = 200, search = '' } = req.query;
    const { _id } = req.user;

    const { favoriteNotices } = await User.findOne({
      _id: _id,
    });

    const skip = (page - 1) * limit;
    const result = await Notice.find(
      {
        _id: favoriteNotices.map(noticeId => noticeId),
        title: { $regex: `${search}` },
      },
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
  const { _id } = req.user;
  const { path: tempAvatarPath, originalname } = req.file;

  const avatarsPath = path.resolve('./public/avatars');

  const [, extension] = originalname.split('.');

  const avatarName = `${_id}.${extension}`;
  const resultAvatarPath = `${avatarsPath}/${avatarName}`;

  const avatarURL = `${process.env.HOST}/avatars/${avatarName}`;

  try {
    const tempAvatar = await jimp.read(tempAvatarPath);

    await tempAvatar.quality(80).writeAsync(resultAvatarPath);

    await fs.unlink(tempAvatarPath);

    await updateUserByIdService(_id, { avatarURL });

    res.json({ code: 'avatar-update-success' });
  } catch (error) {
    return res.status(500).json({ code: 'avatar-update-error' });
  }
};

const deleteAvatarController = async (req, res) => {
  const { _id, avatarURL } = req.user;

  const [, extension] = avatarURL.split('.');

  const avatarPath = path.resolve(`./public/avatars/${_id}.${extension}`);

  try {
    await fs.unlink(avatarPath);

    await updateUserByIdService(_id, { avatarURL: null });

    res.json({ avatarURL: null });
  } catch (error) {
    return res.status(500).json({ code: 'avatar-delete-error' });
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getCurrentUserInfoController,
  updateCurrentUserInfoController,
  getOwnController,
  updateFavoriteController,
  getFavoriteController,
  deleteFavoriteController,
  updateAvatarController,
  deleteAvatarController,
};
