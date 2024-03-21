var CronJob = require('cron').CronJob;
var Cron = require('./mongodb_backup.js');
new CronJob('* */30 * * *', function() {
    console.log("---------------------");
    console.log("running a task every 5 Minutes");
    Cron.dbAutoBackUp();
}, null, true, 'America/New_York');