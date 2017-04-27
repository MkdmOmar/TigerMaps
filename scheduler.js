const cron = require("node-cron");

// Frequency of database update.
// Look up "Cron format" and this will make sense.
var updateFreq = "0 * * * *";

function updateDatabase() {
  console.log("Scheduler: updated database");
}

function start() {
  updateDatabase();
  cron.schedule(updateFreq, updateDatabase);
}

module.exports = {
  start: start
};
