const express = require('express');
const schema = require('../schemas/notices');
const authHeaderValidation = require('../middlewares/authHeaderValidation');

const noticeIdValidation = require('../middlewares/notices/noticeIdValidation');
const validation = require('../middlewares/notices/validation');
const upload = require('../middlewares/notices/upload');

const {
  getAll,
  getCategory,
  getById,
  addNotice,
  deleteNotice,
} = require('../controllers/notices');

const router = express.Router();

router.get('/', getAll);
router.get('/category/:categoryName', getCategory);
router.get('/:noticeId', noticeIdValidation, getById);
router.post(
  '/',
  authHeaderValidation,
  validation(schema.addSchema),
  upload.single('avatar'),
  addNotice
);
router.delete(
  '/:noticeId',
  authHeaderValidation,
  noticeIdValidation,
  deleteNotice
);

module.exports = router;
