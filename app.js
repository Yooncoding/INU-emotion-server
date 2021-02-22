const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const resetPoint = require("./utils/resetPoint");
const givePoint = require("./utils/givePoint");

dotenv.config();

const { sequelize } = require("./models");
const app = express();

app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 세팅
const authRouter = require("./routes/auth.router");
const moodRouter = require("./routes/mood.router");
const bettingRouter = require("./routes/betting.router");
app.use("/auth", authRouter);
app.use("/mood", moodRouter);
app.use("/betting", bettingRouter);

resetPoint;
givePoint;

app.use((req, res, next) => {
  const error = new Error("접속 페이지 없음");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

app.listen(app.get("port"), () => {
  console.log("server start");
});
