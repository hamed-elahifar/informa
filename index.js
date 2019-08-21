//------------------ // بسم الله الرحمن الرحيم // ---------------------

const cluster                 = require('cluster')
  ,   cpuCount                = require('os').cpus().length
 
if (cluster.isMaster) {
    console.clear();
    require('./server/server')

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i++) {cluster.fork()}

    // Listen for dying workers
    cluster.on('exit', function () {require('./server/server')});

  } else {
    // else forke worker
    require('./server/worker');
}

