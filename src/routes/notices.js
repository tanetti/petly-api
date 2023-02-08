const express = require('express');
const router = new express.Router();
const authHeaderValidation = require('../middlewares/authHeaderValidation');

const upload = require('../middlewares/uploadImage');
const noticeIdParameterValidation = require('../middlewares/idRequestParameterValidation/noticeIdParameterValidation');
const noticeCategoryParameterValidation = require('../middlewares/noticeCategoryParameterValidation/validation');
const noticeBodyValidation = require('../middlewares/noticeBodyValidation/validation');

const {
  getNoticeCategoryController,
  getUserOwnNoticesController,
  getUserFavoriteNoticesController,
  getNoticeById,
  addNoticeController,
  deleteNoticeByIdAndOwnerController,
} = require('../controllers/notices');

const compressImage = require('../middlewares/compressImage');

router.get('/own', authHeaderValidation, getUserOwnNoticesController);
router.get('/favorite', authHeaderValidation, getUserFavoriteNoticesController);
router.get(
  '/category/:categoryName',
  noticeCategoryParameterValidation,
  getNoticeCategoryController
);
router.get('/:noticeId', noticeIdParameterValidation, getNoticeById);
router.post(
  '/',
  authHeaderValidation,
  upload.single('notice_avatar'),
  compressImage,
  noticeBodyValidation,
  addNoticeController
);
router.delete(
  '/:noticeId',
  authHeaderValidation,
  noticeIdParameterValidation,
  deleteNoticeByIdAndOwnerController
);

module.exports = router;
