const express = require('express');
const router = new express.Router();
const authHeaderValidation = require('../middlewares/authHeaderValidation');

const upload = require('../middlewares/uploadImage');
const noticeIdParameterValidation = require('../middlewares/idRequestParameterValidation/noticeIdParameterValidation');
const noticeCategoryParameterValidation = require('../middlewares/noticeCategoryParameterValidation/validation');
const noticeBodyValidation = require('../middlewares/noticeBodyValidation/validation');

const {
  getNoticesByCategory,
  getOwnNotices,
  getFavoriteNotices,
  getNoticeById,
  addNotice,
  deleteNoticeById,
} = require('../controllers/notices');

const compressImage = require('../middlewares/compressImage');

router.get('/own', authHeaderValidation, getOwnNotices);
router.get('/favorite', authHeaderValidation, getFavoriteNotices);
router.get(
  '/category/:categoryName',
  noticeCategoryParameterValidation,
  getNoticesByCategory
);
router.get('/:noticeId', noticeIdParameterValidation, getNoticeById);
router.post(
  '/',
  authHeaderValidation,
  upload.single('notice_avatar'),
  compressImage,
  noticeBodyValidation,
  addNotice
);
router.delete(
  '/:noticeId',
  authHeaderValidation,
  noticeIdParameterValidation,
  deleteNoticeById
);

module.exports = router;
