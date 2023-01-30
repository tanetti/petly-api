const User = require("../models/user");

const signupUserService = async (userData) => {
  const user = new User(userData);

  const result = await user.save();

  return result;
};

const findUserByObjectOfParameters = async (object) => {
  const user = await User.findOne(object);

  return user;
};

const findUserByIdService = async (_id) => {
  const user = await User.findById(_id);

  return user;
};

const updateUserByIdService = async (_id, body) => {
  await User.findByIdAndUpdate(_id, body);
};

module.exports = {
  signupUserService,
  findUserByObjectOfParameters,
  findUserByIdService,
  updateUserByIdService,
};