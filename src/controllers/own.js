const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
require('dotenv').config();

const avatarsPath = path.resolve('./public/own_avatars');

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

  const [extension] = originalname.split('.').reverse();

  try {
    const { _id: ownId } = await addOwnService({ ...req.body, owner: _id });

    const avatarName = `${ownId}.${extension}`;
    const resultAvatarPath = `${avatarsPath}/${avatarName}`;

    const avatarURL = `${process.env.HOST}/own_avatars/${avatarName}`;

    const tempAvatar = await jimp.read(tempAvatarPath);

    const width = tempAvatar.getWidth();
    const height = tempAvatar.getHeight();
    const isHorizontal = width > height;
    const ratio = isHorizontal ? width / height : height / width;
    const newWidth = isHorizontal ? 500 * ratio : 500;
    const newHeight = isHorizontal ? 500 : 500 * ratio;

    await tempAvatar
      .resize(newWidth, newHeight)
      .quality(80)
      .writeAsync(resultAvatarPath);

    await fs.unlink(tempAvatarPath);

    await updateOwnByIdService(ownId, { avatarURL });

    res.json({ code: 'own-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const deleteOwnByIdController = async (req, res) => {
  const { ownId } = req.params;

  try {
    const result = await deleteOwnByIdService(ownId);

    if (!result) {
      return res.status(404).json({ code: 'own-delete-not-found-error' });
    }

    if (result.avatarURL) {
      const [extension] = result.avatarURL.split('.').reverse();

      const avatarPath = path.resolve(
        `./public/own_avatars/${ownId}.${extension}`
      );

      await fs.unlink(avatarPath);
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
