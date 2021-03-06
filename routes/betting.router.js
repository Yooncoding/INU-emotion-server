const express = require("express");
const { isLoggIned } = require("../middlewares/auth.middleware");
const { isBettedToday, isBettingTime } = require("../middlewares/betting.middleware");
const Betting = require("../models/betting");
const User = require("../models/user");

const router = express.Router();

router.use(isLoggIned);

/**
 * @description 오늘 온도 맞추기 베팅하기
 * @route POST /betting
 * @TODO test가 끝나고나서 isBettingTime(베팅가능 시간인지 확인해주는 미들웨어) 넣기
 */
router.post("/", isBettedToday, isBettingTime, async (req, res, next) => {
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
  const monthRanking = {};
  const allRanking = [];
  const myPoint = {};
  const { nick } = req.user;
  try {
    const ranking = await User.findAll({
      attributes: ["nick", "point"],
      order: [["point", "DESC"]],
    });
    for (let i = 0; i < ranking.length; i++) {
      allRanking.push(ranking[i].dataValues);
      if (ranking[i].dataValues.nick === nick) {
        myPoint["rank"] = i + 1;
        myPoint["point"] = ranking[i].point;
      }
    }
    // TODO: 월간 랭킹 순위는 몇 위 까지 보여줄것 인지 정하기 (임시: 6명)
    for (let i = 0; i < 6; i++) {
      monthRanking[`${i + 1}위`] = allRanking[i];
    }
    // 예시) "monthRanking": { "1위": {"nick": "oldman", "point": 60000}, "2위": {"nick": "hihi", "point": 30000}, ...}
    // 예시) "myPoint": {"rank": 7, "point": 2000}
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
