const User = require('../models/user');

const registerUserService = async userData => {
  const user = new User(userData);

  const result = await user.save();

  return result;
};

const findUserByObjectOfParameters = async object => {
  const user = await User.findOne(object);

  return user;
};

const findUserByIdService = async _id => {
  const user = await User.findById(_id);

  return user;
};

const updateUserByIdService = async (_id, body) => {
  await User.findByIdAndUpdate(_id, body);
};

const addTokenToUserByIdService = async (_id, token) => {
  await User.findByIdAndUpdate(_id, {
    $push: {
      token,
    },
  });
};

const removeTokenFromUserByIdService = async (_id, token) => {
  await User.findByIdAndUpdate(_id, {
    $pull: {
      token,
    },
  });
};

const addUserFavoriteByIdService = async (_id, favoriteId) => {
  await User.findByIdAndUpdate(_id, {
    $push: {
      favoriteNotices: favoriteId,
    },
  });
};

const deleteUserFavoriteByIdService = async (_id, favoriteId) => {
  await User.findByIdAndUpdate(_id, {
    $pull: {
      favoriteNotices: favoriteId,
    },
  });
};

module.exports = {
  registerUserService,
  findUserByObjectOfParameters,
  findUserByIdService,
  updateUserByIdService,
  addTokenToUserByIdService,
  removeTokenFromUserByIdService,
  addUserFavoriteByIdService,
  deleteUserFavoriteByIdService,
};
