const express = require('express');

const ctrlNews = require("../../controllers/newsController");

const ctrlWrappers = require("../../helpers/ctrlWrappers")


const router = express.Router();

router.get('/', ctrlWrappers(ctrlNews));