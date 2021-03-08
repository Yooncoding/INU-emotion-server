const express = require("express");
const Sequelize = require("sequelize");
const { isLoggIned } = require("../middlewares/auth.middleware");
const { isSubmitedToday, isSubmitTime } = require("../middlewares/mood.middleware");
const elements = require("../utils/elements");
const Mood = require("../models/mood");

const router = express.Router();

router.use(isLoggIned);
/**
 * @description 오늘 온도 제출하기
 * @route POST /mood
 * @TODO test가 끝나고나서 isSubnitTime(제출가능 시간인지 확인해주는 미들웨어) 넣기
 */
router.post("/", isSubmitedToday, async (req, res, next) => {
  // req.body.element_first, second, third는 utils/elements.js에 있는 요소들이랑 이름을 맞춰 줘야함
  const { select_mood, element_first, element_second, element_third } = req.body;
  const { id } = req.user;
  let result;
  try {
    const mood = await Mood.create({
      select_mood,
      element_first,
      element_second,
      element_third,
      UserId: id,
    });
    result = { success: true, message: "온도 제출 완료" };
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

/**
 * @description 오늘 온도 평균, 오늘 요소 순위 보여주기
 * @route GET /mood
 * @TODO 전체적으로 모든 라우터 리팩토링하기
 */
router.get("/", async (req, res, next) => {
  let result;
  const Op = Sequelize.Op;
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  let max = 0;
  let maxString1 = []; // 첫 번째로 큰 value값을 지닌 key값들의 집합
  let maxString2 = []; // 두 번째로 큰 value값을 지닌 key값들의 집합
  let maxString3 = []; // 세 번째로 큰 value값을 지닌 key값들의 집합
  let E_rank = [];
  try {
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
    if (todayMood.length === 0) {
      result = { success: false, message: "아직 오늘 제출된 온도가 없습니다." };
    } else {
      // TODO: 여기에 요소 순위 기능 추가할 것
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
      E_rank.push(maxString1, maxString2, maxString3);

      result = { success: true, message: `오늘의 온도: ${todayMoodAvg}`, todayMoodAvg, elementRanking: E_rank };
    }
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(403).json(result);
    else res.status(201).json(result);
  }
});

module.exports = router;
