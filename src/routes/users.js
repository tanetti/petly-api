const express = require('express');
const router = new express.Router();

const userBodyValidation = require('../middlewares/userBodyValidation/validation');
const authHeaderValidation = require('../middlewares/authHeaderValidation');
const upload = require('../middlewares/notices/upload');

const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getOwnController,
  updateFavoriteController,
  getFavoriteController,
  deleteFavoriteController,
  getCurrentUserInfoController,
  updateCurrentUserInfoController,
  updateAvatarController,
  deleteAvatarController,
} = require('../controllers/users');

router.get('/refresh', authHeaderValidation, refreshController);
router.post('/login', userBodyValidation, loginController);
router.post('/register', userBodyValidation, registerController);
router.post('/logout', authHeaderValidation, logoutController);

router.get('/current', authHeaderValidation, getCurrentUserInfoController);
router.patch(
  '/current',
  authHeaderValidation,
  userBodyValidation,
  updateCurrentUserInfoController
);

router.get('/own', authHeaderValidation, getOwnController);

router.get('/favorite', authHeaderValidation, getFavoriteController);
router.patch(
  '/favorite/:noticeId',
  authHeaderValidation,
  updateFavoriteController
);
router.delete(
  '/favorite/:noticeId',
  authHeaderValidation,
  deleteFavoriteController
);

router.post(
  '/avatars',
  authHeaderValidation,
  upload.single('avatar'),
  updateAvatarController
);
router.delete('/avatars', authHeaderValidation, deleteAvatarController);

module.exports = router;
