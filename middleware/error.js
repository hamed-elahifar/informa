const winston = require('winston');

module.exports = function(err, req, res, next) {

    winston.error(err);

    // const levels = { 
    //     error: 0, 
    //     warn: 1, 
    //     info: 2, 
    //     verbose: 3, 
    //     debug: 4, 
    //     silly: 5 
    // };

    res.status(err.status || 500)
       .send({status:   'error',
              code:     '500',
              msg:      'با عرض پوزش خطایی در سیستم رخ داده است، جزئیات این خطا برای تیم فنی ارسال شد',
              isDone:   false});
}