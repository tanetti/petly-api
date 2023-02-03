const Notice = require('../models/notices');
const HttpError = require('../helpers/HttpError');
const path = require('path');
const fs = require('fs/promises');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 200, search = '' } = req.query;

    const skip = (page - 1) * limit;
    const result = await Notice.find({ title: { $regex: `${search}` } }, '', {
      skip,
      limit: Number(limit),
    }).populate('owner', '_id email');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.params;

    const { page = 1, limit = 200, search = '' } = req.query;

    const skip = (page - 1) * limit;
    const result = await Notice.find(
      { category: categoryName, title: { $regex: `${search}` } },
      '',
      {
        skip,
        limit: Number(limit),
      }
    ).populate('owner', '_id email');
    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { noticeId } = req.params;

    console.log(noticeId);
    const result = await Notice.findOne({
      _id: noticeId,
    });
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const addNotice = async (req, res, next) => {
  const { _id: id } = req.user;

  if (!req.file) {
    const imageName = 'petly.png';

    try {
      const resultUpload = path.join(avatarsDir, imageName);
      await fs.rename(resultUpload, resultUpload);
      const petsAvatarURL = path.join('public', 'avatars', imageName);
      const result = await Notice.create({
        ...req.body,
        petsAvatarURL,
        owner: id,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
    return;
  }

  const { path: tempUpload, originalname } = req.file;
  const imageName = `${id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, imageName);
    await fs.rename(tempUpload, resultUpload);
    const petsAvatarURL = path.join('public', 'avatars', imageName);
    const result = await Notice.create({
      ...req.body,
      petsAvatarURL,
      owner: id,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const { _id } = req.user;

    const result = await Notice.findByIdAndRemove({
      _id: noticeId,
      owner: _id,
    });

    if (result === null) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getCategory,
  getById,
  addNotice,
  deleteNotice,
};
