var log = require("app/log");

/*eslint no-unused-vars:0*/
function errorHandler(error, req, res, next) {
  log.error(error, "express error handler middleware");
  res.status(error.status || 500).send(error);
}

module.exports = errorHandler;
