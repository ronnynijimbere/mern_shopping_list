const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { Item } = require("../models/Item");
const { User } = require("../models/User");
const { items, addDummyItems, users, addDummyUsers } = require("./seed/seed");

beforeEach(addDummyUsers);
beforeEach(addDummyItems);

describe("POST /", () => {
  it("should add a new Item", (done) => {
    var text = "Testing todo route";

    request(app)
      .post("/")
      .set("x-auth", users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        Item.find({ text })
          .then((items) => {
            expect(items.length).toBe(1);
            expect(items[0].text).toBe(text);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });

  it("should not create item with invalid body data", (done) => {
    request(app)
      .post("")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then((items) => {
            expect(items.length).toBe(2);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
});

describe("DELETE /:id", () => {
  it("Should remove an Item", (done) => {
    var hexId = items[1]._id.toHexString();

    request(app)
      .delete(`/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.item._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then((item) => {
            expect(item).toBeNull();
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });

  it("Should not remove an item if its from a different user", (done) => {
    var hexId = items[0]._id.toHexString();

    request(app)
      .delete(`/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then((item) => {
            expect(item).not.toBeNull();
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });

  it("Should return 404 if item not found", (done) => {
    var hexID = new ObjectID().toHexString();

    request(app)
      .delete(`/${hexID}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", (done) => {
    var email = "ex@emil.com";
    var password = "12345678!";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect((res) => {
        expect(res.headers["x-auth"]).not.toBeNull();
        expect(res.body._id).not.toBeNull();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) return done(err);

        User.findOne({ email }).then((user) => {
          expect(user).not.toBeNull();
          expect(user.password).not.toBe(password);
          done();
        });
      });
  });

  it("should return validation errors if request is invalid", (done) => {
    request(app)
      .post("/users")
      .send({
        email: "someRandomText",
        password: "011001RandomPswd",
      })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", (done) => {
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "12345670",
      })
      .expect(400)
      .end(done);
  });
});
