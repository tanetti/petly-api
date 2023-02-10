const Pet = require('../models/pet');

const addNewPet = async data => {
  const pet = new Pet(data);

  const result = await pet.save();

  return result;
};

const updatePetById = async (_id, body) => {
  await Pet.findByIdAndUpdate(_id, body);
};

const findPetById = async _id => {
  const result = await Pet.findById(_id);

  return result;
};

const findPetByOwnerId = async ownerId => {
  const result = await Pet.find({ owner: ownerId })
    .sort({ created_at: 'desc' })
    .select('-__v -owner -created_at');

  return result;
};

const deletePetById = async _id => {
  const result = await Pet.findOneAndDelete({ _id });

  return result;
};

module.exports = {
  addNewPet,
  updatePetById,
  findPetById,
  findPetByOwnerId,
  deletePetById,
};
