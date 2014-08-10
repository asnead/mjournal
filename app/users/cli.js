#!/usr/bin/env node
var cli = require("app/cli");
var program = require("commander");
var signUpOp = require("app/users/operations/sign-up");
var promptly = require("promptly");

function signUp(email) {
  promptly.password("password for " + email + ": ", function(error, password) {
    console.log("registering " + email);
    signUpOp({
      email: email,
      password: password
    }, function(error, user) {
      if (error) {
        cli.exit(error);
      }
      console.log(user);
      /* eslint no-process-exit:0 */
      process.exit();
    });
  });
}

program.description("operate on user records");
program.command("sign-up <email>")
  .description("register a new user account").action(signUp);
program.parse(process.argv);
