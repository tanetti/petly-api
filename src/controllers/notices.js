const jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');

const {
  findSortedByDateCategoryNoticesService,
  findSortedByDateUserOwnNoticesService,
  findSortedByDateUserFavotiteNoticesService,
  addNoticeService,
  updateNoticeByIdService,
  deleteNoticeByParametersService,
  getNoticeByIdService,
} = require('../services/notices');

const getNoticeCategoryController = async (req, res) => {
  const { categoryName } = req.params;
  const { search = '' } = req.query;

  try {
    const result = await findSortedByDateCategoryNoticesService(
      categoryName,
      search
    );

    if (!result) {
      throw new Error('notices-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const getUserOwnNoticesController = async (req, res) => {
  const { _id } = req.user;
  const { search = '' } = req.query;

  try {
    const result = await findSortedByDateUserOwnNoticesService(_id, search);

    if (!result) {
      throw new Error('notices-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const getUserFavoriteNoticesController = async (req, res) => {
  const { favoriteNotices } = req.user;
  const { search = '' } = req.query;

  try {
    const result = await findSortedByDateUserFavotiteNoticesService(
      favoriteNotices,
      search
    );

    if (!result) {
      throw new Error('notices-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const getNoticeById = async (req, res) => {
  const { noticeId } = req.params;

  try {
    const result = await getNoticeByIdService(noticeId);

    if (!result) {
      throw new Error('notice-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
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

const deleteNoticeByIdAndOwnerController = async (req, res) => {
  const { noticeId } = req.params;
  const { _id: owner } = req.user;

  try {
    await deleteNoticeByParametersService({ _id: noticeId, owner });

    res.json({ code: 'notice-delete-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

module.exports = {
  getNoticeCategoryController,
  getUserOwnNoticesController,
  getUserFavoriteNoticesController,
  getNoticeById,
  addNoticeController,
  deleteNoticeByIdAndOwnerController,
};
