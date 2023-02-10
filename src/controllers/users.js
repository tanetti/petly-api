const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  registerUser,
  findUserByParams,
  findUserById,
  updateUserById,
  addTokenToUserById,
  removeTokenFromUserById,
  addUserFavoriteById,
  deleteUserFavoriteById,
} = require('../services/users');

const { uploadAvatar, destroyAvatarByUrl } = require('../services/cloudinary');

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    const { email } = result;

    res.status(201).json({ email });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ code: 'register-email-0102-error' });
    }

    return res.status(400).json({ code: error.message });
  }
};

const login = async (req, res) => {
  const { email: requestEmail, password: requestPassword } = req.body;

  try {
    const user = await findUserByParams({ email: requestEmail });

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

    await addTokenToUserById(userId, token);

    const result = { token, userId };

    res.json(result);
  } catch (error) {
    return res.status(401).json({ code: error.message });
  }
};

const refresh = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await findUserById(_id);

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

const logout = async (req, res) => {
  const { _id } = req.user;
  const { currentToken: token } = req;

  try {
    const user = await findUserById(_id);

    if (!user) {
      throw new Error('logout-no-user');
    }

    await removeTokenFromUserById(user._id, token);

    res.status(204).json({});
  } catch (error) {
    return res.status(400).json({ code: error.message });
  }
};

const getCurrentUserInfo = async (req, res) => {
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

const updateCurrentUserInfo = async (req, res) => {
  const { _id } = req.user;
  const body = req.body;

  try {
    await updateUserById(_id, body);

    res.json({ code: 'user-update-success' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ code: 'user-update-email-0102-error' });
    }

    return res.status(400).json({ code: error.message });
  }
};

const getFavorite = async (req, res) => {
  const { _id } = req.user;

  try {
    const { favoriteNotices } = await findUserById(_id);

    res.json(favoriteNotices);
  } catch (error) {
    return res.status(400).json({ code: error.message });
  }
};

const updateFavorite = async (req, res) => {
  const { _id } = req.user;
  const { noticeId } = req.params;

  try {
    if (!noticeId) {
      throw new Error('favorite-no-id-error');
    }

    await addUserFavoriteById(_id, noticeId);

    res.json({ code: 'favorite-update-success' });
  } catch (error) {
    return res.status(400).json({ code: error.message });
  }
};

const deleteFavorite = async (req, res, next) => {
  const { _id } = req.user;
  const { noticeId } = req.params;

  try {
    if (!noticeId) {
      throw new Error('favorite-no-id-error');
    }

    await deleteUserFavoriteById(_id, noticeId);

    res.json('favorite-delete-success-error');
  } catch (error) {
    return res.status(400).json({ code: error.message });
  }
};

const updateAvatar = async (req, res) => {
  const { _id, avatarURL: oldAvatarUrl } = req.user;
  const { compressedImagePath, fieldName } = req;

  try {
    if (oldAvatarUrl) await destroyAvatarByUrl(oldAvatarUrl);

    const { url } = await uploadAvatar(compressedImagePath, fieldName);

    await fs.unlink(compressedImagePath);

    await updateUserById(_id, { avatarURL: url });

    res.json({ code: 'avatar-update-success' });
  } catch (error) {
    return res.status(500).json({ code: 'avatar-update-error' });
  }
};

const deleteAvatar = async (req, res) => {
  const { _id, avatarURL } = req.user;

  try {
    await destroyAvatarByUrl(avatarURL);

    await updateUserById(_id, { avatarURL: null });

    res.json({ code: 'avatar-delete-success' });
  } catch (error) {
    return res.status(500).json({ code: 'avatar-delete-error' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getCurrentUserInfo,
  updateCurrentUserInfo,
  updateFavorite,
  getFavorite,
  deleteFavorite,
  updateAvatar,
  deleteAvatar,
};
