const schedule = require("node-schedule");
const User = require("../models/user");

// 매달(매월 1일 자정) 유저들의 점수 초기화
const resetPoint = schedule.scheduleJob("00 00 00 01 * *", async () => {
  const allUser = await User.findAll({
    attributes: ["id"],
  });
  for (let i = 0; i < allUser.length; i++) {
    await User.update({ point: 0 }, { where: { id: allUser[i].id } });
  }
});

module.exports = resetPoint;
