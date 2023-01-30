const express = require('express');

const newsController = require('../controllers/newsController');
const ctrlWrappers = require('../helpers/ctrlWrappers');

const router = express.Router();

router.get('/', ctrlWrappers(newsController));

module.exports = router;
