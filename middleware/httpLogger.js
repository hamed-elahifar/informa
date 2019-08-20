const fs        = require('fs')
  ,   {join}    = require('path')


  module.exports    = async function requestLogger(req,res,next){
    const time      = new Date();
    const filename  = time.toISOString().split('T')[0] + '--access.log'

    console.log();
    ip = req.ip.substr(0, 7) == "::ffff:" ? req.ip.substr(7) : req.ip
    console.log(`${time.getHours()}:${time.getMinutes()} | ProcessID: ${process.pid} | ${ip} | ${req.method} | ${req.originalUrl} |`);
    console.log('req.body:   ', req.body);
    console.log('req.params: ', req.params);
    console.log('req.query:  ', req.query);
    console.log('-----------------------------------------------------------------------');


    const location = join(__dirname,'..','logs',filename)
    fs.appendFile(location, req.method +' '+ req.originalUrl+'\r\n'+
                            JSON.stringify(req.body)+'\r\n'+'\r\n',
                            err => {if (err) throw new Error()});

    next();
}

// module.exports = requestLogger;