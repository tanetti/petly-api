const express = require('express');
const router = new express.Router();
const schema = require('../schemas/notices');
const authHeaderValidation = require('../middlewares/authHeaderValidation');

const noticeIdValidation = require('../middlewares/notices/noticeIdValidation');
const validation = require('../middlewares/notices/validation');
const upload = require('../middlewares/notices/upload');

const {
  getAll,
  getCategory,
  getById,
  addNoticeController,
  deleteNotice,
} = require('../controllers/notices');

router.get('/', getAll);
router.get('/category/:categoryName', getCategory);
router.get('/:noticeId', noticeIdValidation, getById);
router.post(
  '/',
  authHeaderValidation,
  upload.single('notice_avatar'),
  validation(schema.addSchema),
  addNoticeController
);
router.delete(
  '/:noticeId',
  authHeaderValidation,
  noticeIdValidation,
  deleteNotice
);

module.exports = router;
