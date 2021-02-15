const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

/**
 * @description 회원가입
 * @route POST /auth/register
 * @TODO 회원가입방법: 1. 학교이메일인증 2. 전산원에서 상태코드받아 포털아이디로 로그인
 */
router.post("/register", async (req, res, next) => {
  const { email, nick, password } = req.body;
  let result;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      result = { success: false, message: "존재하는 이메일입니다." };
    } else {
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(12));
      await User.create({
        email,
        nick,
        password: hash,
      });
      result = { success: true, message: "가입완료" };
    }
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(409).json(result);
    else res.status(201).json(result);
  }
});

module.exports = router;
