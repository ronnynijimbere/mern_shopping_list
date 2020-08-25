const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Item } = require("../../models/Item");
const { User } = require("../../models/User");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: "person1@gmail.com",
    password: "test123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneID, access: "auth" }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
  {
    _id: userTwoID,
    email: "person2@gmail.com",
    password: "test123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoID, access: "auth" }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
];

const items = [
  {
    _id: new ObjectID(),
    text: "eggs",
    _creator: userOneID,
  },
  {
    _id: new ObjectID(),
    text: "milk",
    _creator: userTwoID,
  },
];

var addDummyItems = (done) => {
  Todo.deleteMany({})
    .then(() => {
      return Item.insertMany(items);
    })
    .then(() => done());
};

var addDummyUsers = (done) => {
  User.deleteMany({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  items,
  addDummyItems,
  users,
  addDummyUsers,
};
