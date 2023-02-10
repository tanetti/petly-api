const fs = require('fs/promises');
require('dotenv').config();

const createNewImagePath = require('../utilities/createNewImagePath');

const { uploadAvatar, destroyAvatarByUrl } = require('../services/cloudinary');

const {
  addNewPet,
  updatePetById,
  findPetById,
  findPetByOwnerId,
  deletePetById,
} = require('../services/pets');

const getPet = async (req, res) => {
  const { _id } = req.user;

  try {
    const result = await findPetByOwnerId(_id);

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const addPet = async (req, res) => {
  const { _id } = req.user;
  const { compressedImagePath, fieldName } = req;

  try {
    const { _id: petId } = await addNewPet({ ...req.body, owner: _id });

    const newImagePath = createNewImagePath(compressedImagePath, petId);

    await fs.rename(compressedImagePath, newImagePath);

    const { url } = await uploadAvatar(newImagePath, fieldName);

    await fs.unlink(newImagePath);

    await updatePetById(petId, { avatarURL: url });

    res.json({ code: 'pet-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const deletePet = async (req, res) => {
  const { petId } = req.params;

  try {
    const currentOwn = await findPetById(petId);

    if (!currentOwn) {
      return res.status(404).json({ code: 'pet-delete-not-found-error' });
    }

    await destroyAvatarByUrl(currentOwn.avatarURL);

    await deletePetById(petId);

    res.json({ code: 'pet-delete-success' });
  } catch (error) {
    return res.status(500).json({ code: 'pet-delete-error' });
  }
};

module.exports = {
  getPet,
  addPet,
  deletePet,
};
