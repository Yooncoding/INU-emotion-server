const Sequelize = require("sequelize");
const schedule = require("node-schedule");
const Mood = require("../models/mood");
const Archive = require("../models/archive");
const elements = require("./elements");

// 하루가 지나기전(매일 23시 55분)에 평균 온도와 날짜를 archive에 저장
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
  const elementGroup = [];
  for (let i = 0; i < todayMood.length; i++) {
    for (let j = 0; j < elements.length; j++) {
      if (elements[j] === todayMood[i].element_first) {
        elementGroup.push(todayMood[i].element_first);
      } else if (elements[j] === todayMood[i].element_second) {
        elementGroup.push(todayMood[i].element_second);
      } else if (elements[j] === todayMood[i].element_third) {
        elementGroup.push(todayMood[i].element_third);
      }
    }
  }
  const elementCount = elementGroup.reduce((a, c) => {
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});
  let max = 0;
  let maxString1 = [];
  let maxString2 = [];
  let maxString3 = [];
  // 객체 내에서 가장 큰 값을 지닌 value값을 찾음
  for (let string in elementCount) {
    if (max < elementCount[string]) {
      max = elementCount[string];
    }
  }
  // 위에서 찾아낸 value값을 가지는 객체의 key값을 push해주면서 최대값을 가지는 객체의 원소 일부를 삭제
  for (let string in elementCount) {
    if (max === elementCount[string]) {
      maxString1.push(string);
      delete elementCount[string];
    }
  }
  // 2번째 큰수
  max = 0;
  for (let string in elementCount) {
    if (max < elementCount[string]) {
      max = elementCount[string];
    }
  }
  for (let string in elementCount) {
    if (max === elementCount[string]) {
      maxString2.push(string);
      delete elementCount[string];
    }
  }
  // 3번째 큰수
  max = 0;
  for (let string in elementCount) {
    if (max < elementCount[string]) {
      max = elementCount[string];
    }
  }
  for (let string in elementCount) {
    if (max === elementCount[string]) {
      maxString3.push(string);
      delete elementCount[string];
    }
  }
  let E_rank = [];
  E_rank.push(maxString1, maxString2, maxString3);
  let archiveElements = [];
  for (let i = 0; i < E_rank.length; i++) {
    for (let j = 0; j < E_rank[i].length; j++) {
      if (archiveElements.length === 3) {
        break;
      }
      archiveElements.push(E_rank[i][j]);
    }
  }
  const archive = await Archive.create({
    mood: todayMoodAvg,
    date: TODAY_START,
    element_first: archiveElements[0],
    element_second: archiveElements[1],
    element_third: archiveElements[2],
  });
});

module.exports = saveTodayMood;
