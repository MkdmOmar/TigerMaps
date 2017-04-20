function lastUpdated(datafeed)
{
  // query database for a timestamp of when the datafeed was last updated
}

function onConnection()
{
  // check if database needs updating here, in case Heroku Scheduler
  // missed an update.
  //console.log("connection!")
}

module.exports = {
  onConnection: onConnection
};
