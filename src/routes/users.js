const express = require('express');
const router = new express.Router();

const userBodyValidation = require('../middlewares/userBodyValidation/validation');
const authHeaderValidation = require('../middlewares/authHeaderValidation');

const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getOwn,
  updateFavorite,
  getFavorite,
  deleteFavorite,
} = require('../controllers/users');

router.post('/register', userBodyValidation, registerController);
router.post('/login', userBodyValidation, loginController);
router.get('/refresh', authHeaderValidation, refreshController);
router.post('/logout', authHeaderValidation, logoutController);
router.get('/own', authHeaderValidation, getOwn);

router.patch('/favorite/:noticeId', authHeaderValidation, updateFavorite);
router.get('/favorite', authHeaderValidation, getFavorite);
router.delete('/favorite/:noticeId', authHeaderValidation, deleteFavorite);

module.exports = router;
