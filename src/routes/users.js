const express = require('express');
const router = new express.Router();

const upload = require('../middlewares/uploadImage');
const compressImage = require('../middlewares/compressImage');
const authHeaderValidation = require('../middlewares/authHeaderValidation');
const userBodyValidation = require('../middlewares/userBodyValidation/validation');
const noticeIdParameterValidation = require('../middlewares/idRequestParameterValidation/noticeIdParameterValidation');

const {
  register,
  login,
  refresh,
  logout,
  updateFavorite,
  getFavorite,
  deleteFavorite,
  getCurrentUserInfo,
  updateCurrentUserInfo,
  updateAvatar,
  deleteAvatar,
} = require('../controllers/users');

router.get('/refresh', authHeaderValidation, refresh);
router.post('/login', userBodyValidation, login);
router.post('/register', userBodyValidation, register);
router.post('/logout', authHeaderValidation, logout);

router.get('/current', authHeaderValidation, getCurrentUserInfo);
router.patch(
  '/current',
  authHeaderValidation,
  userBodyValidation,
  updateCurrentUserInfo
);

router.get('/favorite', authHeaderValidation, getFavorite);
router.patch('/favorite/:noticeId', authHeaderValidation, updateFavorite);
router.delete(
  '/favorite/:noticeId',
  authHeaderValidation,
  noticeIdParameterValidation,
  deleteFavorite
);

router.post(
  '/avatars',
  authHeaderValidation,
  upload.single('user_avatar'),
  compressImage,
  updateAvatar
);
router.delete('/avatars', authHeaderValidation, deleteAvatar);

module.exports = router;
