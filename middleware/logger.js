const fs          = require('fs')
  ,   {join}      = require('path')

exports.log = function(message){

    const header = '---------------'+Date().toString()+'---------------'+'\r\n'
    const location = join(__dirname,'..','logs','activities.log')
    fs.appendFile(location, header+JSON.stringify(message)+'\r\n', err => {if (err) throw new Error()});

}