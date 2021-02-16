require("date-utils");
const Sequelize = require("sequelize");
const Mood = require("../models/mood");

module.exports = {
  isSubmitedByToday: async (req, res, next) => {
    const Op = Sequelize.Op;
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
};
