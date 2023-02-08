const Own = require('../models/own');

const addOwnService = async data => {
  const own = new Own(data);

  const result = await own.save();

  return result;
};

const updateOwnByIdService = async (_id, body) => {
  await Own.findByIdAndUpdate(_id, body);
};

const findOwnById = async _id => {
  const result = await Own.findById(_id);

  return result;
};

const findOwnByOwner = async owner => {
  const result = await Own.find({ owner })
    .sort({ created_at: 'desc' })
    .select('-__v -owner -created_at');

  return result;
};

const deleteOwnByIdService = async _id => {
  const result = await Own.findOneAndDelete({ _id });

  return result;
};

module.exports = {
  addOwnService,
  updateOwnByIdService,
  findOwnById,
  findOwnByOwner,
  deleteOwnByIdService,
};
