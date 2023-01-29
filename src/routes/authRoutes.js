const express = require("express");
const authRoutes = express.Router();
const { Register } = require("../controllers/authControl");
const { Validate } = require("../middlewares/validation");
const { userSchemaValid } = require("../models/user");

authRoutes.post("/register", Validate(userSchemaValid), Register);

/*
authRoutes.put('/user/', updateUserData)
*/

module.exports = authRoutes;