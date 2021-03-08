// const express = require("express");
// const { isLoggIned } = require("../middlewares/auth.middleware");
// const User = require("../models/user");

// const router = express.Router();

// router.use(isLoggIned);
// /**
//  * @description 내 점수 보기
//  * @route GET /user/point
//  * @TODO 내 점수 보기를 따로 만들지, 메인페이지에 같이 넣을지 정하기
//  */
// router.get("/point", async (req, res, next) => {
//   let result;
//   try {
//     // isLoggIned에서 req.user.id값을 id로 받아옴
//     const { id } = req.user;
//     let myPoint = await User.findOne({
//       attributes: ["point"],
//       where: { id },
//     });
//     // myPoint에 값을 받아오게 수정했습니다.
//     myPoint = myPoint.dataValues.point;
//     result = { success: true, message: "로그인한 id의 포인트 반환", point: myPoint };
//   } catch (error) {
//     console.error(error);
//     next(error);
//   } finally {
//     if (!result.success) res.status(403).json(result);
//     else res.status(201).json(result);
//   }
// });

// module.exports = router;
