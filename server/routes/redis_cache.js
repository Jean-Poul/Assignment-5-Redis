const axios = require("axios");
const express = require("express");
const redis = require("redis");
const client = redis.createClient();
// This is connectiong to Redis on default port on localhost. To connect to a specific server provide data like this:
// createClient({
//   url: 'redis://alice:foobared@awesome.redis.server:6380'
// });
const rds = express.Router();
const URL =
  "https://datausa.io/api/data?measures=Average%20Wage,Average%20Wage%20Appx%20MOE&drilldowns=Detailed%20Occupation";

client.on("error", function (err) {
  console.log("CLIENT ERROR:");
  console.log(err);
});

rds.route("/cache_data/:ttl?").get(async (req, res) => {
  const DEFAULT_EXP = 15;
  const set_key = "avr_wage";
  const ttl =
    req.params.ttl && !isNaN(req.params.ttl) ? req.params.ttl : DEFAULT_EXP;

  const res_body = { cached: false };
  await client.connect();
  // Check if there is data in DB
  let data = await client.get("data");
  let res_data;
  if (data) {
    res_data = JSON.parse(data);
    // cache data for given or default exp time
    await client.setEx("data", ttl, data);
    res_body.cached = true;
    await sorted_set(set_key, res_data, client, res_body);
  } else {
    await axios.get(URL).then(
      // fetch data
      async function (response) {
        res_data = response.data.data;
        //cache data
        await client.setEx("data", ttl, JSON.stringify(res_data));
        await sorted_set(set_key, res_data, client, res_body);
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
  //delete sorted set from DB
  await client.del(set_key);
  await client.disconnect();
  res.json(res_body);
});

const sorted_set = async (set_key, res_data, client, res_body) => {
  // an array of score-value objects
  const elements = [];
  res_data.forEach((d) => {
    elements.push({
      score: d["Average Wage"],
      value: JSON.stringify(d),
    });
  });

  //add vslues with scores to a sorted set
  const r = await client.zAdd(set_key, elements);

  // get value with the highest score
  const top_result = await client.ZRANGE_WITHSCORES(set_key, 0, 0);
  const top_score = top_result[0].score;
  const top_value = top_result[0].value;
  res_body.top_result = { score: top_score, value: JSON.parse(top_value) };
  res_body.alldata = res_data;
};

module.exports = rds;
