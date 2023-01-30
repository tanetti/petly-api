const express = require('express');


const {auth: authControllers} = require('../../controllers');
const { validation, authMiddleware } = require('../../middlewares');
const { loginSchema } = require('../../schemas/authSchema');

const router = express.Router();

router.post("/login", validation(loginSchema), authControllers.loginUserController);
router.get("/logout",authMiddleware, authControllers.logoutUserController);