const express = require("express");
const authRoutes = express.Router();
const { Register, updateUserData, getUserData } = require("../controllers/authControl");
const { addPet, deletePet } = require("../controllers/cardControl");
const { Validate } = require("../middlewares/validation");
const { userSchemaValid } = require("../models/user");
const { petSchema } = require('../models/pets');

authRoutes.post("/register", Validate(userSchemaValid), Register);

authRoutes.put('/user/:id', Validate(userSchemaValid), updateUserData)

authRoutes.get('/user/:id', getUserData)

authRoutes.post('/user/:id/add', Validate(petSchema), addPet)

authRoutes.delete('/user/:id', deletePet)


module.exports = authRoutes;