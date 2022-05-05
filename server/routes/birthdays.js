const express = require("express");

const birthdayRouts = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

birthdayRouts.route("/10birthdays").get(function (req, res) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("birthdays")
    .find()
    .sort({ _id: -1 })
    .limit(10)
    .toArray(function (err, result) {
      if (err) throw err;

      res.json(result);
    });
});

birthdayRouts.route("/addbirthday").post(function (req, res) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("birthdays")
    .insertOne(req.body, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = birthdayRouts;
