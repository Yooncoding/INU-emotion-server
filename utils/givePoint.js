const Sequelize = require("sequelize");
const schedule = require("node-schedule");
const Betting = require("../models/betting");
const User = require("../models/user");
const Mood = require("../models/mood");

const givePoint = schedule.scheduleJob("00 00 23 * * *", async () => {
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
  // betting테이블에서 오늘 만들어진 베팅값중 베팅 온도가 오늘 평균 온도와 같은 UserId속성만 가져옴
  const answer_users_num1 = await Betting.findAll({
    attributes: ["UserId"],
    where: {
      bet_mood: todayMoodAvg,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });

  //user테이블에 있는 기존의 point값을 가져와 1000점을 더해줘야함
  for (let i = 0; i < answer_users_num1.length; i++) {
    const pre_point = await User.findAll({
      attributes: ["point"],
      where: {
        id: answer_users_num1[i].UserId,
      },
    });
    const point = await User.update(
      {
        point: pre_point[0].point + 1000,
      },
      {
        where: {
          id: answer_users_num1[i].UserId,
        },
      }
    );
    console.log(point);
  }

  // 2등 포인트 지급
  const answer_users_num2 = await Betting.findAll({
    attributes: ["UserId"],
    where: {
      [Op.or]: [{ bet_mood: todayMoodAvg - 1 }, { bet_mood: todayMoodAvg + 1 }],
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });
  for (let i = 0; i < answer_users_num2.length; i++) {
    const pre_point = await User.findAll({
      attributes: ["point"],
      where: {
        id: answer_users_num2[i].UserId,
      },
    });
    const point = await User.update(
      {
        point: pre_point[0].point + 700,
      },
      {
        where: {
          id: answer_users_num2[i].UserId,
        },
      }
    );
  }

  // 3등 포인트 지급
  const answer_users_num3 = await Betting.findAll({
    attributes: ["UserId"],
    where: {
      [Op.or]: [{ bet_mood: todayMoodAvg - 2 }, { bet_mood: todayMoodAvg + 2 }],
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });
  for (let i = 0; i < answer_users_num3.length; i++) {
    const pre_point = await User.findAll({
      attributes: ["point"],
      where: {
        id: answer_users_num3[i].UserId,
      },
    });
    const point = await User.update(
      {
        point: pre_point[0].point + 500,
      },
      {
        where: {
          id: answer_users_num3[i].UserId,
        },
      }
    );
  }
});

module.exports = givePoint;
