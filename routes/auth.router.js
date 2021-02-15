const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

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

/**
 * @description 로그인
 * @route POST /auth/login
 * @TODO 회원가입 방법 결정되면 vaildator만들기
 */
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let result;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) result = { success: false, message: "존재하지 않는 이메일 입니다." };
    else {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
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
