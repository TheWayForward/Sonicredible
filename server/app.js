const config = require("./config");
const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const rateLimit = require("express-rate-limit");

const rateLimitPlugin = rateLimit({
  windowMs: 1000,
  max: 200,
  message: {
    code: 429,
    message: "busy"
  },
  headers: true
});

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const audioRouter = require("./routes/audio");
const commandRouter = require("./routes/command");
const voiceprintRouter = require("./routes/voiceprint");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(rateLimitPlugin);

app.use(express.static(path.join(__dirname, "")));
app.use(rateLimitPlugin);
app.use("/api/v1/index", indexRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/audio", audioRouter);
app.use("/api/v1/command", commandRouter);
app.use("/api/v1/voiceprint", voiceprintRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
