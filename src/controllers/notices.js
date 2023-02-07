const Notice = require('../models/notices');
const HttpError = require('../helpers/HttpError');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');

const {
  addNoticeService,
  updateNoticeByIdService,
} = require('../services/notices');

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

const addNoticeController = async (req, res) => {
  const { _id } = req.user;
  const { path: tempAvatarPath, originalname } = req.file;
  const avatarsPath = path.resolve('./public/notice_avatars');

  const [extension] = originalname.split('.').reverse();

  try {
    const { _id: noticeId } = await addNoticeService({
      ...req.body,
      owner: _id,
    });

    const avatarName = `${noticeId}.${extension}`;
    const resultAvatarPath = `${avatarsPath}/${avatarName}`;

    const avatarURL = `${process.env.HOST}/notice_avatars/${avatarName}`;

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

    await updateNoticeByIdService(noticeId, { avatarURL });

    res.json({ code: 'notice-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
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
  addNoticeController,
  deleteNotice,
};
