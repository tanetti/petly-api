const express = require('express');
const router = new express.Router();

const userBodyValidation = require('../middlewares/userBodyValidation/validation');
const authHeaderValidation = require('../middlewares/authHeaderValidation');

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
} = require('../controllers/users');

router.post('/register', userBodyValidation, registerController);
router.post('/login', userBodyValidation, loginController);
router.get('/refresh', authHeaderValidation, refreshController);
router.post('/logout', authHeaderValidation, logoutController);
router.get('/own', authHeaderValidation, getOwnController);

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

router.get('/current', authHeaderValidation, getCurrentController);

module.exports = router;
