const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const error = new Error("접속 페이지 없음");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(err.status || 500);
});

app.listen(app.get("port"), () => {
  console.log("server start");
});
