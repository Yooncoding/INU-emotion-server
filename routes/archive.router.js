const express = require("express");
const Sequelize = require("sequelize");
const Archive = require("../models/archive");

const router = express.Router();

/**
 * @description 주간, 월간
 * @route /archive
 * @TODO 이렇게 하는것보다 params를 줘서 달력에 클릭했을 때 요소들 나오게하는게 더 좋았을 것 같다.
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
      order: [["date", "asc"]],
    });
    for (let i = 0; i < monthMood.length; i++) {
      archive.push([monthMood[i].mood, [monthMood[i].element_first, monthMood[i].element_second, monthMood[i].element_third]]);
    }
    // 예시) "archive": [[24(온도), ["집밥","과제","시험"]], [34(온도), ["시험","업무",null]], ...]
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
