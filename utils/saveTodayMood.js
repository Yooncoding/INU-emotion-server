const Sequelize = require("sequelize");
const schedule = require("node-schedule");
const Mood = require("../models/mood");
const Archive = require("../models/archive");

const saveTodayMood = schedule.scheduleJob("00 55 23 * * *", async () => {
  const Op = Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const todayMoodSum = await Mood.sum("select_mood", {
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });
  const todayMood = await Mood.findAll({
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });
  const todayMoodAvg = parseInt(todayMoodSum / todayMood.length);
  const archive = await Archive.create({
    mood: todayMoodAvg,
    date: TODAY_START,
  });
});

module.exports = saveTodayMood;
