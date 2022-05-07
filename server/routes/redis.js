const redis = require("redis");
// console.log(redis);
const redisClient = redis.createClient();
const axios = require("axios");
const cors = require("cors");
const express = require("express");
//const req = require("express/lib/request");
//const { response } = require("express");

const redisRouts = express.Router();

// This is connectiong to on default port on lcalhost, to connect to a specific server provide data like this:
// createClient({
//   url: 'redis://alice:foobared@awesome.redis.server:6380'
// });

redisRouts.use(express.urlencoded({ extended: true }));
redisRouts.use(cors());

const url =
  "https://datausa.io/api/data?measures=Average%20Wage,Average%20Wage%20Appx%20MOE&drilldowns=Detailed%20Occupation";

const DEFAULT_EXPIRATION = 120;

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
  await redisClient.connect();
  console.log("body " + req.body.Year);
  //let added = await client.get("alldata");
  const dataId = req.query.Year;
  //const dataId = req.body.Year;
  console.log("query " + dataId);
  // ?Year=${dataId}
  // const alldata = await getOrSetCache(`alldata`, async function () {
  //   const { data } = await axios.get(url, { params: { dataId } });
  //   console.log("DATA ALL: " + data);
  //   await redisClient.quit();
  //   return data;
  // });
  const alldata = await redisClient.get(`alldata?Year=${dataId}`);

  if (alldata != null) {
    console.log("Cache hit");

    redisClient.quit();
    return res.json(JSON.parse(alldata));
  } else {
    console.log("Cache miss");
    //, { params: { dataId }}
    const { data } = await axios.get(url, { params: { dataId } });
    redisClient.SETEX(
      `alldata?Year=${dataId}`,
      DEFAULT_EXPIRATION,
      JSON.stringify(data)
  );
  await redisClient.quit();
  res.json(data);
  }
  //  , async (error, alldata) => {
  //   const dataId = req.query.Year;
  //   if (error) console.error('Error: ', error);
  //   if (alldata != null) {
  //     console.log("Cache hit");
  //     return res.json(JSON.parse(alldata));
  //   } else {
  //     console.log("Cache miss");
  //     //, { params: { dataId }}
  //     const {data } = await axios.get(url, { params: { dataId }});
  //     Redisclient.setEx("alldata", DEFAULT_EXPIRATION, JSON.stringify(data));
  //     res.json(data);
  //   }
  // }

  // // res.json({ added })
  // console.log("redis result" + added);
  // if (added === null) {
  //   const { data } = await axios.get(url).then(
  //     (response) => {
  //       //console.log(JSON.stringify(response.data));
  //       //client.set('alldata', JSON.stringify(response.data));
  //       client.setex('alldata', DEFUALT_EXPIRATION, JSON.stringify(data))
  //       added = response.data;
  //       console.log(typeof response.data);
  //       client.quit();
  //     },
  //     (error) => {
  //       console.error("Error:", error);
  //     }
  //   );
  // } else {
  //   added = JSON.parse(added);
  //   console.log("else:" + added);
  // }

  // res.json({ added });

  // await Redisclient.quit();
});

redisRouts.route("/all/:id").get(async (req, res) => {
  const singledata = await getOrSetCache(
    `alldata:${req.params.id}`,
    async () => {
      const { data } = await axios.get(
        `https://datausa.io/api/data?measures=Average%20Wage,Average%20Wage%20Appx%20MOE&drilldowns=Detailed%20Occupation/${req.params.id}`
      );
      return data;
    }
  );
  res.json(singledata);
});

function getOrSetCache(key, callback) {
  console.log("KEY: " + key);
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      console.log("DATA FUNCTION: " + data);
      if (error) return reject(error);
      if (data != null) return resolve(JSON.parse(data));
      const newData = await callback();
      await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(newData));
      resolve(newData);
    });
  });
}

module.exports = redisRouts;
