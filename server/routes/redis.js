const redis = require("redis");
// console.log(redis);
const client = redis.createClient();
const axios = require("axios");

// This is connectiong to on default port on lcalhost, to connect to a specific server provide data like this:
// createClient({
//   url: 'redis://alice:foobared@awesome.redis.server:6380'
// });

const express = require("express");
const req = require("express/lib/request");
const { response } = require("express");

const redisRouts = express.Router();

redisRouts.route("/redis").get(function (req, res) {
  res.json({ msg: "Hello" });
});

redisRouts.route("/add_value").post(async (req, res) => {
  await client.connect();
  console.log(req.body);
  const key = Object.getOwnPropertyNames(req.body)[0];
  const value = req.body[key];
  await client.set(key, value);
  const added = await client.get(key);
  await client.disconnect();
  res.json({ added });
});

redisRouts.route("/all").get(async (req, res) => {
  const url =
    "https://datausa.io/api/data?measures=Average%20Wage,Average%20Wage%20Appx%20MOE&drilldowns=Detailed%20Occupation";
  await client.connect();

  let added = await client.get("alldata");

  // res.json({ added })
  console.log("redis result" + added);
  if (added === null) {
    await axios.get(url).then(
      (response) => {
        //console.log(JSON.stringify(response.data));
        client.set("alldata", JSON.stringify(response.data));
        added = response.data;
        console.log(typeof response.data);
        client.quit();
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  } else {
    added = JSON.parse(added);
    console.log("else:" + added);
  }

  res.json({ added });

  await client.quit();
});
module.exports = redisRouts;
