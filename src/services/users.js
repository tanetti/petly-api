const User = require('../models/user');

const registerUser = async userData => {
  const user = new User(userData);

  const result = await user.save();

  return result;
};

const findUserByParams = async object => {
  const user = await User.findOne(object);

  return user;
};

const findUserById = async _id => {
  const user = await User.findById(_id);

  return user;
};

const updateUserById = async (_id, body) => {
  await User.findByIdAndUpdate(_id, body);
};

const addTokenToUserById = async (_id, token) => {
  await User.findByIdAndUpdate(_id, {
    $push: {
      token,
    },
  });
};

const removeTokenFromUserById = async (_id, token) => {
  await User.findByIdAndUpdate(_id, {
    $pull: {
      token,
    },
  });
};

const addUserFavoriteById = async (_id, favoriteId) => {
  await User.findByIdAndUpdate(_id, {
    $push: {
      favoriteNotices: favoriteId,
    },
  });
};

const deleteUserFavoriteById = async (_id, favoriteId) => {
  await User.findByIdAndUpdate(_id, {
    $pull: {
      favoriteNotices: favoriteId,
    },
  });
};

module.exports = {
  registerUser,
  findUserByParams,
  findUserById,
  updateUserById,
  addTokenToUserById,
  removeTokenFromUserById,
  addUserFavoriteById,
  deleteUserFavoriteById,
};
