require("date-utils");
const Sequelize = require("sequelize");
const Mood = require("../models/mood");
const Op = Sequelize.Op;
module.exports = {
  // 오늘 온도 제출을 했는지 확인하는 미들웨어
  isSubmitedToday: async (req, res, next) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const existUser = await Mood.findOne({
      where: {
        UserId: req.user.id,
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    if (!existUser) next();
    else {
      res.status(403).json({ success: false, message: "이미 오늘 온도를 제출하였습니다." });
    }
  },
  // 온도 제출이 가능한 시간(07시 ~ 23시)인지 확인 하는 미들웨어
  isSubmitTime: async (req, res, next) => {
    const NOW = new Date();
    const HOUR = NOW.getHours();
    const bettingTime = 7 <= HOUR && HOUR <= 22;
    if (bettingTime) {
      next();
    } else {
      res.status(403).json({ success: false, message: "베팅이 금지된 시간입니다." });
    }
  },
};
