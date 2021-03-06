const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
const request = require("request");

dotenv.config();

module.exports = {
  // 로그인 상태 확인 미들웨어 -> 로그인이 되어있어야지만 이용할 수 있는 서비스앞에 배치
  isLoggIned: (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      res.status(403).json({ success: false, message: "로그인이 필요합니다." });
    } else {
      const auth = bearerToken.split(" ");
      if (auth[0] === "Bearer" || auth[0] === "Token") {
        req.user = verify(auth[1], process.env.JWT_SECRET);
        next();
      } else res.status(401).json({ success: false, message: "다시 로그인이 필요합니다." });
    }
  },
  // 학교 포탈사이트 로그인 인증 미들웨어 -> 회원가입 라우터로 넘어감
  isAuthenticated: (req, res, next) => {
    const { email, password } = req.body;
    let data = `log=${email}&pwd=${password}`;
    let options = {
      method: "POST",
      url: "https://ok.inu.ac.kr/learning/ability/wp-login.php",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    };
    request(options, (error, response) => {
      if (error) throw new Error(error);
      else {
        if (response.headers["set-cookie"][2].match(/wrong_password/)) {
          res.status(403).json({ success: false, message: "학번과 비밀번호를 다시 확인해주세요." });
        } else if (response.headers["set-cookie"][4].match(/logged_in/)) {
          next();
        }
      }
    });
  },
};
