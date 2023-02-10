const express = require('express');
const router = new express.Router();

const getNews = require('../controllers/news');

router.get('/', getNews);

module.exports = router;
