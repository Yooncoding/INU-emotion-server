const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const router = express.Router();
dotenv.config();

/**
 * @description 회원가입
 * @route POST /auth/register
 * @TODO 로그인 안되어 있는상태에서 회원가입가능 미들웨어, 이메일은 숫자 9자리만 받을 수 있음 확인
 */
router.post("/register", isAuthenticated, async (req, res, next) => {
  const { email, nick, password } = req.body;
  let result;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      result = { success: false, message: "이미 가입한 회원입니다." };
    } else {
      const existNick = await User.findOne({ where: { nick } });
      if (existNick) {
        result = { success: false, message: "이미 존재하는 닉네임입니다." };
      } else {
        const hash = await bcrypt.hash(password, await bcrypt.genSalt(12));
        await User.create({
          email,
          nick,
          password: hash,
        });
        result = { success: true, message: "가입완료" };
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(409).json(result);
    else res.status(201).json(result);
  }
});

/**
 * @description 로그인
 * @route POST /auth/login
 * @TODO 학번과 비밀번호 로그인을 입력하라는 문구가 있으면 좋을 것 같음
 */
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let result;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) result = { success: false, message: "아직 가입하지 않은 회원입니다." };
    else {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, nick: user.nick }, process.env.JWT_SECRET);
        result = { success: true, message: "로그인 성공", token };
      } else {
        result = { success: false, message: "비밀번호가 일치하지 않습니다." };
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  } finally {
    if (!result.success) res.status(400).json(result);
    else res.status(201).json(result);
  }
});

module.exports = router;
