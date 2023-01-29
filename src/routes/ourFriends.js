const express = require("express");

const ctrl = require("../controllers");

const { ctrlWrapper } = require("../helers");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getServices));

module.exports = router;
