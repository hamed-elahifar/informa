const {exec}                = require('child_process')
  ,   events                = require('events')
  ,   {Result}              = require('../models/results')
  ,   moment                = require('moment')
  ,   Redis                 = require("redis")
  ,   bluebird              = require('bluebird')
//   ,   tcpie                 = require('tcpie');

                              require('../startup/db')();
                             
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
    
const redis                = Redis.createClient()

const eventEmitter         = new events.EventEmitter();

setInterval(() => {eventEmitter.emit(process.pid)}, 1000); //1sec

// linux ping function
if (process.platform !== "win32") {
    console.log('Unix like os deteced')
    function sysPing(host) {
        return new Promise((resolve, reject) => {
            exec("ping -c 1 -n -i 1 -W1 " + host + " | grep icmp_seq=1 | cut -d' ' -f7 | cut -d'=' -f2",
                (err, stdout, stderr) => {
                    if (err)    { reject(err) }
                    if (stderr) { reject(stderr) }
                    if (stdout) {
                        resolve(parseInt(stdout));
                    } else {reject(-1)}
                });
        });
    }
}
// windows ping function
if (process.platform === "win32") {
    console.log('Win os deteced')
    function sysPing(host) {
        return new Promise((resolve, reject) => {
            exec('ping -n 1 -w 300 ' + host + ' | find "Reply"',(err, stdout, stderr) => {
                    try {
                        if (err)    { reject(err) }
                        if (stderr) { reject(stderr) }
                        if (stdout) {
                            stdout = stdout.split(' ');
                            stdout = stdout[4].split('=');
                            resolve(parseInt(stdout[1]));
                        } else {
                            reject(-1);
                        }
                    } catch (err) {console.log(err)}
            });
        });
    }
}
// const pie = tcpie('google.com', 443, {count: 1, interval: 500, timeout: 1000});

// pie
//     .on('connect', function(stats) {
//         console.info('connect', stats);
//     })
//     .on('error', function(err, stats) {
//         console.error(err, stats);
//     })
//     .on('timeout', function(stats) {
//         console.info('timeout', stats);
//     })
//     .on('end', function(stats) {
//         console.info(stats)
//     })
//     .start();

eventEmitter.on(process.pid, async () => {
    try{
        let host = await redis.blpopAsync('targets',0)
            host = host[1]

        const pingResult = await sysPing(host);

        var updateINFO              = {}
        updateINFO['ip']            = host
        updateINFO
        [moment.utc().format('mm')] = pingResult;

        console.log(updateINFO,process.pid);

        const updateResult = await Result.updateOne({
            $and: [
                { date: moment.utc().format('YYYY-MM-DD') },
                { hour: moment.utc().format('HH') },
                { ip:   host },
            ]
        }, updateINFO,{upsert:true});

        } catch(e){console.log(e)}
});

