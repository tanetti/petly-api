const express = require('express');
const router = new express.Router();

const userBodyValidation = require('../middlewares/userBodyValidation/validation');
const authHeaderValidation = require('../middlewares/authHeaderValidation');

const {
  registerController,
  loginController,
  refreshController,
  logoutController,
} = require('../controllers/users');

router.post('/register', userBodyValidation, registerController);
router.post('/login', userBodyValidation, loginController);
router.post('/refresh', authHeaderValidation, refreshController);
router.post('/logout', authHeaderValidation, logoutController);

module.exports = router;
