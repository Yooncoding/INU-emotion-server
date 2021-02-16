require("date-utils");
const Sequelize = require("sequelize");
const Betting = require("../models/betting");

module.exports = {
  isBettedToday: async (req, res, next) => {
    const Op = Sequelize.Op;
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
