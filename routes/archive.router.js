const express = require("express");
const Sequelize = require("sequelize");
const Archive = require("../models/archive");

const router = express.Router();

/**
 * @description 주간, 월간
 * @route /archive
 * @TODO
 */
router.get("/", async (req, res, next) => {});

module.exports = router;
