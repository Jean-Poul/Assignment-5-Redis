const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5555;
app.use(cors());
app.use(express.json());
app.use(require("./routes/tweets"));
app.use(require("./routes/birthdays"));
app.use(require("./routes/redis"));
app.use(require("./routes/redis_cache"));
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
