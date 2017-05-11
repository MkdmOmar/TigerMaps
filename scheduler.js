const cron = require("node-cron");

const parser = require("./parser");

// Frequency of database update.
// Look up "Cron format" and this will make sense.
var updateFreq = "0 * * * *";

function updateDatabase() {
    console.log("Scheduler: updated database");
    parser.updateDB();
}

function start() {
    updateDatabase();
    cron.schedule(updateFreq, updateDatabase);
}

module.exports = {
    start: start
};