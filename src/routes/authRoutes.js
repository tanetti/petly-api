const express = require('express')
const authRoutes = express.Router()
const { Register } = require('../controllers/authControl')

/*
const { userSchemaValid } = require('../models/user')
const { validate } = require('../middlewares/validation')
*/

authRoutes.post('/register', Register)

/*
authRoutes.put('/user/', updateUserData)
*/

module.exports = authRoutes