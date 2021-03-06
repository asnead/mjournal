var expect = require("chaimel");
var signUp = require("app/users/operations/signUp");
var testUtils = require("app/testUtils");

describe("POST /api/users/sign-in", function() {
  [
    {},
    {email: "test@example.com"},
    {password: "password"}
  ].forEach(function(user) {
    it("should 400 incomplete credentials", function(done) {
      testUtils.post("/api/users/sign-in")
        .send(user)
        .expect(400)
        .end(done);
    });
  });

  it("should 200 a valid user", function(done) {
    var newUser = {
      email: "users/api/signUp@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).toBeNull();
      testUtils.post("/api/users/sign-in")
        .send(newUser)
        .expect(200)
        .end(done);
    });
  });
});

describe("POST /api/users/sign-up", function() {
  [
   {},
   {email: "test@example.com"},
   {password: "password"}
  ].forEach(function(user) {
    it("should 400 incomplete credentials", function(done) {
      testUtils.post("/api/users/sign-up")
        .send(user)
        .expect(400)
        .end(done);
    });
  });

  it("should 409 a re-register", function(done) {
    var newUser = {
      email: "users/api/signUp/re-register@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).toBeNull();
      testUtils.post("/api/users/sign-up")
        .send(newUser)
        .expect(409)
        .end(done);
    });
  });
});

describe("POST /api/users/key anonymous", function () {
  it("should 401 an anonymous user", function(done) {
    testUtils.post("/api/users/key")
      .expect(401, done);
  });
});

describe("PUT /api/users anonymous", function () {
  it("should 401 an anonymous user", function(done) {
    testUtils.put("/api/users")
      .expect(401, done);
  });
});

describe("POST /api/users/key authorized", function () {
  var key;
  before(function (done) {
    this.session = new testUtils.Session();
    this.session.post("/api/users/sign-up")
      .send({email: "key/authorized@example.com", password: "password"})
      .expect(201)
      .end(done);
  });

  it("should 201 a key for a known user", function(done) {
    this.session.post("/api/users/key")
      .expect(201)
      .end(function (error, res) {
        expect(res.body).toHaveProperty("key");
        expect(res.body.key.length).toEqual(20);
        key = res.body.key;
        done();
      });
  });

  //test depends on previous one. kthnxbai.
  it("should allow access to entries with key", function (done) {
    testUtils.get("/api/entries")
     .set("Authorization", "key " + key)
     .expect("Content-Type", "application/json; charset=utf-8")
     .expect(200, done);
  });
});
