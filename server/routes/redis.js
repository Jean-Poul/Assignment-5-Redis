const redis = require("redis");
// console.log(redis);
const client = redis.createClient();

// This is connectiong to on default port on lcalhost, to connect to a specific server provide data like this:
// createClient({
//   url: 'redis://alice:foobared@awesome.redis.server:6380'
// });

const express = require("express");

const redisRouts = express.Router();

redisRouts.route("/redis").get(function (req, res) {
  res.json({ msg: "Hello" });
});

redisRouts.route("/add_value").post(async (req, res) => {
  await client.connect();

  const key = Object.getOwnPropertyNames(req.body)[0];
  const value = req.body[key];
  await client.set(key, value);
  const added = await client.get(key);
  await client.disconnect();
  res.json({ added });
});
module.exports = redisRouts;
