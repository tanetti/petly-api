const fs = require('fs/promises');
require('dotenv').config();

const {
  uploadCloudinary,
  deleteCloudinary,
} = require('../helpers/cloudinaryUpload');

const getAvatarName = require('../helpers/getAvatarName');

const { findUserByIdService } = require('../services/users');

const {
  addOwnService,
  updateOwnByIdService,
  findOwnByOwner,
  deleteOwnByIdService,
} = require('../services/own');

const getOwnController = async (req, res) => {
  const { _id } = req.user;

  try {
    const result = await findOwnByOwner({ _id });

    let finalResult = null;

    if (result.length) {
      const sortedResult = result.sort((a, b) => b.created_at - a.created_at);

      finalResult = sortedResult;
    } else {
      finalResult = result;
    }

    res.json(finalResult);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const addOwnController = async (req, res) => {
  const { _id } = req.user;
  const { path: tempAvatarPath, originalname } = req.file;
  const imageName = `${_id}_${originalname}`;

  try {
    const { _id: ownId } = await addOwnService({ ...req.body, owner: _id });

    const avatarURL = uploadCloudinary(tempAvatarPath, imageName);

    await fs.unlink(tempAvatarPath);

    await updateOwnByIdService(ownId, { avatarURL });

    res.json({ code: 'own-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const deleteOwnByIdController = async (req, res) => {
  const { _id } = req.user;

  const { ownId } = req.params;

  try {
    const { avatarURL } = await findUserByIdService(_id);
    const avatartUrl = avatarURL;
    const avatarName = await getAvatarName(avatartUrl);

    const result = await deleteOwnByIdService(ownId);

    if (!result) {
      return res.status(404).json({ code: 'own-delete-not-found-error' });
    }
    if (result) {
      await deleteCloudinary(avatarName);
    }

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
