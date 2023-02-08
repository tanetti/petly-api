const fs = require('fs/promises');

const createNewImagePath = require('../utilities/createNewImagePath');

const {
  uploadNoticeAvatarService,
  destroyAvatarByUrlService,
} = require('../services/cloudinary');

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
  const { compressedImagePath } = req;

  try {
    const { _id: noticeId } = await addNoticeService({
      ...req.body,
      owner: _id,
    });

    const newImagePath = createNewImagePath(compressedImagePath, noticeId);

    await fs.rename(compressedImagePath, newImagePath);

    const { url } = await uploadNoticeAvatarService(newImagePath);

    await fs.unlink(newImagePath);

    await updateNoticeByIdService(noticeId, { avatarURL: url });

    res.json({ code: 'notice-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const deleteNoticeByIdAndOwnerController = async (req, res) => {
  const { noticeId } = req.params;
  const { _id: owner } = req.user;

  try {
    const currentNotice = await getNoticeByIdService(noticeId);

    if (!currentNotice) {
      return res.status(404).json({ code: 'notice-delete-not-found-error' });
    }

    await destroyAvatarByUrlService(currentNotice.avatarURL);

    await deleteNoticeByParametersService({
      _id: noticeId,
      owner,
    });

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
