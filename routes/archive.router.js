const express = require("express");
const Sequelize = require("sequelize");
const Archive = require("../models/archive");

const router = express.Router();

/**
 * @description 주간, 월간
 * @route /archive
 * @TODO 어떤 형식으로 보내줄지 회의 후 결정
 */
router.get("/", async (req, res, next) => {
  let result;
  const NOW = new Date();
  const Op = Sequelize.Op;
  const MONTH_START = new Date().setDate(0);
  const archive = [];
  try {
    const monthMood = await Archive.findAll({
      where: {
        date: {
          [Op.gt]: MONTH_START,
          [Op.lt]: NOW,
        },
      },
    });
    for (let i = 0; i < monthMood.length; i++) {
      archive.push([monthMood[i].dataValues.date.toString(), monthMood[i].dataValues.mood]);
    }
    result = { success: true, message: "이번달 온도", archive };
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

module.exports = router;
