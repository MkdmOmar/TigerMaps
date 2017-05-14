const cron = require("node-cron");

const parser = require("./parser");

// Frequencies of database update and clear.
// Look up "Cron format" and this will make sense.
var updateFreq  = "0 * * * *";
var clearFreq   = "* 0 * * *"

function updateDatabase() {
    console.log("Scheduler: updated database");
    parser.updateDB();
}

function clearDatabase() {
    console.log("Scheduler: cleared database");
    parser.clearDB();
}

function start() {
    updateDatabase();
    cron.schedule(updateFreq, updateDatabase);
    cron.schedule(clearFreq, clearDatabase);
}

module.exports = {
    start: start
};