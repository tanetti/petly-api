const fs = require('fs/promises');
require('dotenv').config();

const createNewImagePath = require('../utilities/createNewImagePath');

const {
  uploadOwnAvatarService,
  destroyAvatarByUrlService,
} = require('../services/cloudinary');

const {
  addOwnService,
  updateOwnByIdService,
  findOwnById,
  findOwnByOwner,
  deleteOwnByIdService,
} = require('../services/own');

const getOwnController = async (req, res) => {
  const { _id } = req.user;

  try {
    const result = await findOwnByOwner(_id);

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const addOwnController = async (req, res) => {
  const { _id } = req.user;
  const { compressedImagePath } = req;

  try {
    const { _id: ownId } = await addOwnService({ ...req.body, owner: _id });

    const newImagePath = createNewImagePath(compressedImagePath, ownId);

    await fs.rename(compressedImagePath, newImagePath);

    const { url } = await uploadOwnAvatarService(newImagePath);

    await fs.unlink(newImagePath);

    await updateOwnByIdService(ownId, { avatarURL: url });

    res.json({ code: 'own-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const deleteOwnByIdController = async (req, res) => {
  const { ownId } = req.params;

  try {
    const currentOwn = await findOwnById(ownId);

    if (!currentOwn) {
      return res.status(404).json({ code: 'own-delete-not-found-error' });
    }

    await destroyAvatarByUrlService(currentOwn.avatarURL);

    await deleteOwnByIdService(ownId);

    res.json({ code: 'own-delete-success' });
  } catch (error) {
    return res.status(500).json({ code: 'own-delete-error' });
  }
};

module.exports = {
  getOwnController,
  addOwnController,
  deleteOwnByIdController,
};
