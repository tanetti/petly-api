const Notice = require('../models/notices');
const HttpError = require('../helpers/HttpError');
const fs = require('fs/promises');

const uploadCloudinary = require('../helpers/cloudinaryUpload');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 200, search = '' } = req.query;

    const skip = (page - 1) * limit;
    const result = await Notice.find({ title: { $regex: `${search}` } }, '', {
      skip,
      limit: Number(limit),
    }).populate('owner', '_id email phone');
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
    ).populate('owner', '_id email phone');
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
    }).populate('owner', '_id email phone');
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addNotice = async (req, res, next) => {
  const { _id: id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const imageName = `${id}_${originalname}`;

  try {
    const petsAvatarURL = uploadCloudinary(tempUpload, imageName);

    await fs.unlink(tempUpload);

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
