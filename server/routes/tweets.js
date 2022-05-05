const express = require("express");

const tweetRouts = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

tweetRouts.route("/10tweets").get(function (req, res) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("tweets")
    .find(
      { "entities.hashtags": { $exists: true } },
      { _id: 0, "entities.hashtags.text": 1 }
    )
    .toArray(function (err, result) {
      if (err) throw err;
      const map = result
        .map((r) => r.entities.hashtags)
        .flatMap((x) => x)
        .reduce((previous, current) => {
          previous[current.text]
            ? previous[current.text].amount++
            : (previous[current.text] = { amount: 1, text: current.text });
          current = { ...previous };
          return current;
        }, {});
      const map_arr = Object.values(map);
      map_arr.sort((a, b) => {
        return b.amount - a.amount;
      });
      res.json(map_arr.slice(0, 10));
    });
});

module.exports = tweetRouts;
