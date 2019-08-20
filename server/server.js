const {exec}                = require('child_process')
  ,   events                = require('events')
  ,   {Target}              = require('../models/targets')
  ,   bluebird              = require('bluebird')
  ,   Redis                 = require("redis")
  ,   app                   = require('express')()
  

                              require('express-async-errors');
                              require('../startup/logging')();
                              require('../startup/routes')(app);
                              require('../startup/db')();
  // add promis to redis    
  bluebird.promisifyAll(Redis.RedisClient.prototype);
  bluebird.promisifyAll(Redis.Multi.prototype);
  
  const redis               = Redis.createClient()

  // redis client
  redis.on("error", function (err) {console.log("Error " + err)});

  const eventEmitter = new events.EventEmitter();

  async function fillRedis(){
      targets = await Target.distinct("ip");
      redis.del  ('targets')
      redis.del  ('store')
      redis.rpush('store'  ,targets)
      redis.rpush('targets',targets)
  };
  fillRedis();

  // setInterval(() => { eventEmitter.emit('1sec')  }, 1000);            //1sec
  setInterval(() => { eventEmitter.emit('10sec') }, 1000 * 10);       //10sec
  // setInterval(() => { eventEmitter.emit('1min')  }, 1000 * 60);       //1min
  // setInterval(() => { eventEmitter.emit('5min')  }, 1000 * 60 * 5);   //5min
  // setInterval(() => { eventEmitter.emit('1hour') }, 1000 * 60 * 60);  //1hour

  // duplicate redis "store" to "targets"
  eventEmitter.on('10sec',async function(){
      (async function(){
          return new Promise((resolve, reject) => {
              exec("redis-cli dump store | head -c-1 | redis-cli -x restore targets 0",
              (err, stdout, stderr) => {
                  if (err)    { reject(err) }
                  if (stderr) { reject(stderr) }
                  if (stdout) {
                      // console.log(stdout)
                      resolve();
                  } else {reject(-1)}
              });
          })
      })()
  });

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

  const colors = {
      Reset: "\x1b[0m",
      Bright: "\x1b[1m",
      Dim: "\x1b[2m",
      Underscore: "\x1b[4m",
      Blink: "\x1b[5m",
      Reverse: "\x1b[7m",
      Hidden: "\x1b[8m",
      fg: {
          Black: "\x1b[30m",
          Red: "\x1b[31m",
          Green: "\x1b[32m",
          Yellow: "\x1b[33m",
          Blue: "\x1b[34m",
          Magenta: "\x1b[35m",
          Cyan: "\x1b[36m",
          White: "\x1b[37m",
          Crimson: "\x1b[38m",
      },
      bg: {
          Black: "\x1b[40m",
          Red: "\x1b[41m",
          Green: "\x1b[42m",
          Yellow: "\x1b[43m",
          Blue: "\x1b[44m",
          Magenta: "\x1b[45m",
          Cyan: "\x1b[46m",
          White: "\x1b[47m",
          Crimson: "\x1b[48m",
      }
  };

  Target
      .watch([
          {$match:{'ns.db':'informa',
                   'ns.coll':'targets',
                   // 'operationType':'update'
                  }},
      ], {fullDocument:"updateLookup"})
      .on('change', async (data) => {
          console.log(data);
          await fillRedis();
      });

  const port   = process.env.PORT || 3030;
  const server = app.listen(port, () => console.log(`server sunning on port ${port}`));