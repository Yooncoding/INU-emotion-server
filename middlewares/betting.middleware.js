require("date-utils");
const Sequelize = require("sequelize");
const Betting = require("../models/betting");
const Op = Sequelize.Op;
module.exports = {
  // 오늘 베팅을 했는지 확인하는 미들웨어
  isBettedToday: async (req, res, next) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const existUser = await Betting.findOne({
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
      res.status(403).json({ success: false, message: "이미 오늘 베팅을 하셨습니다." });
    }
  },
  // 베팅 가능한 시간(08시 ~ 20시)인지 확인 하는 미들웨어
  isBettingTime: async (req, res, next) => {
    const NOW = new Date();
    const HOUR = NOW.getHours();
    const bettingTime = 8 <= HOUR && HOUR <= 19;
    if (bettingTime) {
      next();
    } else {
      res.status(403).json({ success: false, message: "베팅이 금지된 시간입니다." });
    }
  },
};
