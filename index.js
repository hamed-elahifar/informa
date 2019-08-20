//------------------ // بسم الله الرحمن الرحيم // ---------------------

const cluster                 = require('cluster')
  ,   cpuCount                = require('os').cpus().length
 
if (cluster.isMaster) {
    console.clear();
  
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i++) {require('./server/server')}
    //cluster.fork()
    // Listen for dying workers
    cluster.on('exit', function () {require('./server/server')});


    // else forke worker
} else {require('./server/worker')}

