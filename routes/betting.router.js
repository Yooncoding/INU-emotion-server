const express = require("express");
const { isLoggIned } = require("../middlewares/auth.middleware");
const { isBettedToday, isBettingTime } = require("../middlewares/betting.validator");
const Betting = require("../models/betting");
const User = require("../models/user");

const router = express.Router();

router.use(isLoggIned);

/**
 * @description 오늘 온도 맞추기 베팅하기
 * @route POST /betting
 * @TODO isBettingTime 구현 해놓은거 마지막에 넣기
 */
router.post("/", isBettedToday, async (req, res, next) => {
  const { bet_mood } = req.body;
  const { id } = req.user;
  let result;
  try {
    const betting = await Betting.create({
      bet_mood,
      UserId: id,
    });
    result = { success: true, message: "베팅 완료" };
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

/**
 * @description 월간 랭킹 보기
 * @route GET /betting
 * @TODO
 */
router.get("/", async (req, res, next) => {
  let result;
  const monthRanking = [];
  const allRanking = [];
  const myPoint = [];
  const { nick } = req.user;
  try {
    const ranking = await User.findAll({
      attributes: ["nick", "point"],
      order: [["point", "DESC"]],
    });
    for (let i = 0; i < ranking.length; i++) {
      allRanking.push(ranking[i].dataValues);
      if (ranking[i].dataValues.nick === nick) {
        myPoint.push({ rank: i + 1, point: ranking[i].dataValues.point });
      }
    }
    // TODO: 월간 랭킹 순위는 몇 위 까지 보여줄것 인지 정하기 (임시: 6명)
    for (let i = 0; i < 6; i++) {
      monthRanking.push(allRanking[i]);
    }
    result = { success: true, message: "월간 포인트 랭킹", monthRanking, myPoint };
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

module.exports = router;
