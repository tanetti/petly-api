const express = require("express");

const getServices = require("../controllers/getServices");

const { ctrlWrapper } = require("../helpers");

const router = new express.Router();

router.get("/", ctrlWrapper(getServices));

module.exports = router;
