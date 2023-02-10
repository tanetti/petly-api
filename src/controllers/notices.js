const fs = require('fs/promises');

const createNewImagePath = require('../utilities/createNewImagePath');

const {
  uploadAvatar,
  destroyAvatarByUrl,
} = require('../services/cloudinary');

const {
  findNoticesByCategory,
  findOwnNotices,
  findFavotiteNotices,
  addNewNotice,
  updateNoticeById,
  deleteNoticeByParams,
  findNoticeById,
} = require('../services/notices');

const getNoticesByCategory = async (req, res) => {
  const { categoryName } = req.params;
  const { search = '' } = req.query;

  try {
    const result = await findNoticesByCategory(categoryName, search);

    if (!result) {
      throw new Error('notices-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const getOwnNotices = async (req, res) => {
  const { _id } = req.user;
  const { search = '' } = req.query;

  try {
    const result = await findOwnNotices(_id, search);

    if (!result) {
      throw new Error('notices-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const getFavoriteNotices = async (req, res) => {
  const { favoriteNotices } = req.user;
  const { search = '' } = req.query;

  try {
    const result = await findFavotiteNotices(favoriteNotices, search);

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
    const result = await findNoticeById(noticeId);

    if (!result) {
      throw new Error('notice-get-error');
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const addNotice = async (req, res) => {
  const { _id } = req.user;
  const { compressedImagePath, fieldName } = req;

  try {
    const { _id: noticeId } = await addNewNotice({
      ...req.body,
      owner: _id,
    });

    const newImagePath = createNewImagePath(compressedImagePath, noticeId);

    await fs.rename(compressedImagePath, newImagePath);

    const { url } = await uploadAvatar(newImagePath, fieldName);

    await fs.unlink(newImagePath);

    await updateNoticeById(noticeId, { avatarURL: url });

    res.json({ code: 'notice-add-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

const deleteNoticeById = async (req, res) => {
  const { noticeId } = req.params;
  const { _id: owner } = req.user;

  try {
    const currentNotice = await findNoticeById(noticeId);

    if (!currentNotice) {
      return res.status(404).json({ code: 'notice-delete-not-found-error' });
    }

    await destroyAvatarByUrl(currentNotice.avatarURL);

    await deleteNoticeByParams({
      _id: noticeId,
      owner,
    });

    res.json({ code: 'notice-delete-success' });
  } catch (error) {
    return res.status(500).json({ code: error.message });
  }
};

module.exports = {
  getNoticesByCategory,
  getOwnNotices,
  getFavoriteNotices,
  getNoticeById,
  addNotice,
  deleteNoticeById,
};
