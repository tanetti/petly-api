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
  getCurrentController,
  updateAvatarController,
  deleteAvatarsController,
} = require('../controllers/users');

router.post('/register', userBodyValidation, registerController);
router.post('/login', userBodyValidation, loginController);
router.get('/refresh', authHeaderValidation, refreshController);
router.post('/logout', authHeaderValidation, logoutController);

router.get('/own', authHeaderValidation, getOwnController);
router.get('/current', authHeaderValidation, getCurrentController);

router.patch(
  '/favorite/:noticeId',
  authHeaderValidation,
  updateFavoriteController
);
router.get('/favorite', authHeaderValidation, getFavoriteController);
router.delete(
  '/favorite/:noticeId',
  authHeaderValidation,
  deleteFavoriteController
);

router.patch(
  '/avatars',
  authHeaderValidation,
  upload.single('avatar'),
  updateAvatarController
);
router.delete('/avatars', authHeaderValidation, deleteAvatarsController);

module.exports = router;
