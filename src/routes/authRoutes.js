const express = require('express')
const authRoutes = express.Router()
const { Register } = require('../controllers/authControl')
const { userSchemaValid } = require('../models/user')
const { validate } = require('../middlewares/validation')

authRoutes.post('/register', validate(userSchemaValid), Register)

module.exports = authRoutes