var _ = require("lodash");
var signUp = require("app/users/operations/signUp");
var ops = require("app/entries/operations");
var expect = require("chaimel");

describe("entries/operations/create+update+view+viewTags", function() {
  var user = null;
  var user2 = null;
  var entry = null;
  before(function(done) {
    var inUser = {
      email: "test/entries/operations/create@example.com",
      password: "password"
    };
    signUp(inUser, function(error, outUser) {
      expect(error).notToExist();
      expect(outUser).toHaveProperty("id");
      user = outUser;
      done();
    });
  });
  before(function(done) {
    var inUser = {
      email: "test/entries/operations/create2@example.com",
      password: "password"
    };
    signUp(inUser, function(error, outUser) {
      expect(error).notToExist();
      expect(outUser).toHaveProperty("id");
      user2 = outUser;
      done();
    });
  });
  it("should create an entry", function(done) {
    var options = {
      user: user,
      body: "test body",
      tags: "e1t1 e1t2"
    };
    ops.create(options, function(error, outEntry) {
      expect(error).notToExist();
      expect(outEntry).toHaveProperty("id");
      expect(outEntry).toHaveProperty("created");
      expect(outEntry).toHaveProperty("updated");
      expect(outEntry).toHaveProperty("body");
      expect(outEntry.body).toEqual(options.body);
      entry = outEntry;
      done();
    });
  });
  it("should create a second entry with different user", function(done) {
    var options = {
      user: user2,
      body: "test body2",
      tags: "e2t1 e2t2"
    };
    ops.create(options, function(error, outEntry) {
      expect(error).notToExist();
      expect(outEntry).toHaveProperty("id");
      expect(outEntry).toHaveProperty("created");
      expect(outEntry).toHaveProperty("updated");
      expect(outEntry).toHaveProperty("body");
      expect(outEntry.body).toEqual(options.body);
      done();
    });
  });
  it("should update an entry", function(done) {
    var options = {
      id: entry.id,
      user: user,
      body: "test body 2"
    };
    var oldUpdated = entry.updated;
    ops.update(options, function(error, outEntry) {
      expect(error).notToExist();
      expect(outEntry).toHaveProperty("body");
      expect(outEntry.body).toEqual(options.body);
      expect(outEntry).toHaveProperty("updated");
      expect(outEntry).toHaveProperty("created");
      expect(oldUpdated).notToEqual(outEntry.updated);
      done();
    });
  });
  it("should view the newly created entry", function(done) {
    ops.view({
      user: user
    }, function(error, entries) {
      expect(error).notToExist();
      expect(entries).notToBeEmpty();
      done();
    });
  });
  it("should view the user's tags", function(done) {
    ops.viewTags({
      user: user
    }, function(error, tags) {
      expect(error).notToExist();
      tags = _.pluck(tags, "text");
      expect(tags.indexOf("e1t1") >= 0).toBeTrue(tags);
      expect(tags.indexOf("e1t2") >= 0).toBeTrue(tags);
      expect(tags.indexOf("e2t1") >= 0).toBeFalse(tags);
      expect(tags.indexOf("e2t2") >= 0).toBeFalse(tags);
      expect(tags.length).toEqual(2);
      done();
    });
  });
  it("should find the entry with text search", function(done) {
    ops.view({
      user: user,
      textSearch: "body"
    }, function(error, entries) {
      expect(error).notToExist();
      expect(entries).notToBeEmpty();
      done();
    });
  });
  it("should not find the entry with non-matching text search", function(done) {
    ops.view({
      user: user,
      textSearch: "notpresent"
    }, function(error, entries) {
      expect(error).notToExist();
      expect(entries).toBeAnInstanceOf(Array);
      expect(entries).toBeEmpty();
      done();
    });
  });
  it("should not update someone else's entry", function(done) {
    var options = {
      id: entry.id,
      user: user2,
      body: "test body 3 hax0rz"
    };
    ops.update(options, function(error, outEntry) {
      expect(error).notToBeNull();
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(404);
      expect(outEntry).toBeUndefined();
      done();
    });
  });
  it("should not delete someone else's entry", function(done) {
    var options = {
      id: entry.id,
      user: user2
    };
    ops.delete(options, function(error) {
      expect(error).notToBeNull();
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(404);
      done();
    });
  });
  it("should delete an entry", function(done) {
    var options = {
      id: entry.id,
      user: user
    };
    ops.delete(options, done);
  });
});
