const cron = require("node-cron");

var updateFreq = "0 * 0 * * *";

function updateDatabase() {
  console.log("update database!");
}

function start() {
  cron.schedule(updateFreq, updateDatabase);
}

module.exports = {
  start: start
};
