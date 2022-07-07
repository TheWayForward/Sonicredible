const app = require("../app");
const debug = require("debug")("server:server");
const http = require("http");
const process = require("process");
const Kardia = require("kardia");
const Config = require("../config");
const SetupHelper = require("../utils/setup_helper");

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
server.on("close", onClose);

let kardia = Kardia.start({
  name: "health-check",
  host: Config.host,
  port: 12800
});

// graceful exit
process.on("SIGINT", () => {
  debug("process: exiting...");
  server.close(() => {
    process.exit(0);
  });
  debug("process: service terminated (SIGINT)");
});

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string"
      ? "Pipe " + port
      : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  // setup
  SetupHelper.setup();

  // listening
  let addr = server.address();
  let bind = typeof addr === "string"
      ? "pipe " + addr
      : "port " + addr.port;
  debug(`Listening on ${bind}, pid ${process.pid}`);
}

function onClose() {
  debug("onClose: service terminated");
}