const express = require("express");
const Sequelize = require("sequelize");
const { isLoggIned } = require("../middlewares/auth.middleware");
const { isSubmitedByToday } = require("../middlewares/mood.validator");
const Mood = require("../models/mood");

const router = express.Router();

router.use(isLoggIned);
/**
 * @description 오늘 온도 제출하기
 * @route POST /mood/submit
 * @TODO 토큰의 user.id를 UserId에 넣고 UserId가 존재하면 이미 제출했다는 vaildator만들기
 */
router.post("/submit", isSubmitedByToday, async (req, res, next) => {
  const { select_mood, element_first, element_second, element_third } = req.body;
  const { id } = req.user;
  let result;
  try {
    const mood = await Mood.create({
      select_mood,
      element_first,
      element_second,
      element_third,
      UserId: id,
    });
    result = { success: true, message: "온도 제출 완료" };
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

/**
 * @description 오늘 온도 평균 보여주기
 * @route GET /mood
 * @TODO 전체적으로 모든 라우터 리팩토링하기
 * @TODO 요소 순위 기능 구현
 */
router.get("/", async (req, res, next) => {
  let result;
  const Op = Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  try {
    const todayMoodSum = await Mood.sum("select_mood", {
      where: {
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    const todayMoodNum = await Mood.findAll({
      where: {
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    const todayMood = parseInt(todayMoodSum / todayMoodNum.length);
    if (!todayMoodNum) {
      result = { success: false, message: "아직 오늘 제출된 온도가 없습니다." };
    } else {
      // TODO: 여기에 요소 순위 기능 추가할 것
      result = { success: true, message: `오늘의 온도: ${todayMood}`, todayMood };
    }
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

module.exports = router;
