const mongoose   = require('mongoose')
  ,   config     = require('config');

const options = {
  useNewUrlParser:    true,
  useCreateIndex:     true,
  useFindAndModify:   false,
  autoIndex:          false,            // Don't build indexes
  // reconnectTries:     Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval:  1000,             // Reconnect every 1000ms = 1sec
  // poolSize:           10,               // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries:   0,
  // connectTimeoutMS:   10000,            // Give up initial connection after 10 seconds
  // socketTimeoutMS:    45000,            // Close sockets after 45 seconds of inactivity
  // family:             4                 // Use IPv4, skip trying IPv6
};
module.exports = function() {
  mongoose.connect(config.get('db'), options)
    .then   (()   => console.log  ('\x1b[7m' ,'\x1b[36m','Connected to LOCAL server...','\x1b[0m'))
    .catch  (err  => {
            console.error('\x1b[31m','\x1b[36m','Could NOT connect to local server...' ,'\x1b[0m')
            console.log(err)
    });
            
    
    // mongoose.connection.once('open',()=>{
    //   console.log  ("\x1b[7m" ,'\x1b[36m','  Connected to LOCAL server...'        ,'\x1b[0m')
    // });
}

