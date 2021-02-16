const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
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
};
