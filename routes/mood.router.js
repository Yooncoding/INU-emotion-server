const express = require("express");
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
 * @TODO
 */
router.get("/", (req, res, next) => {});

module.exports = router;
