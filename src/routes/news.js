const express = require('express');
const router = new express.Router();

const newsController = require('../controllers/news');

router.get('/', newsController);

module.exports = router;
