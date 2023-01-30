const express = require('express');
const router = new express.Router();

const servicesController = require('../controllers/services');

router.get('/', servicesController);

module.exports = router;
