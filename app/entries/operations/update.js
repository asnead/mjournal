var _ = require("lodash");
var clientFields = require("../clientFields");
var db = require("app/db");
var errors = require("app/errors");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");
var Stack = require("app/operations/Stack");

function select(where, callback) {
  db.select("entries", clientFields)
    .where(where)
    .execute(function(error, result) {
      callback(error, presentEntry(result.rows && result.rows[0]));
  });
}

function initDbOp(next, options) {
  this.dbOp = db.update("entries");
  return next();
}

function execute(next, options, callback) {
  var set = {
    updated: new Date()
  };
  ["body", "tags"].forEach(function (property) {
    if (_.has(options, property)) {
      set[property] = options[property];
    }
  });
  if (Array.isArray(set.tags)) {
    set.tags = set.tags.join(" ");
  }
  var where = {
    id: options.id
  };
  this.dbOp.set(set).where(where).execute(function(error, result) {
    if (error) {
      log.info({
        err: error
      }, "error updating an entry");
      callback(error);
      return;
    }
    if (result.rowCount < 1) {
      log.info({options: options}, "zero rowCount on entry update (HAX0RZ?)");
      callback(new errors.NotFound("No entry with id " + options.id));
      return;
    }
    log.debug(result, "entries/update");
    select(where, callback);
  });
}

var stack = new Stack(
  opMW.requireUser,
  initDbOp,
  opMW.whereUser,
  execute
);

function runStack() {
  return stack.run.apply(stack, arguments);
}

module.exports = runStack;
