const express           = require('express')
  ,   RedisStore        = require('rate-limit-redis')
  ,   rateLimit         = require('express-rate-limit')
  
  ,   users             = require('../routes/users')
  ,   targets           = require('../routes/target')
  ,   results           = require('../routes/result')

  ,   helmet            = require('helmet')
  ,   compression       = require('compression')
  ,   error             = require('../middleware/error')
  ,   httpLogger        = require('../middleware/httpLogger')
  ,   JSONValidation    = require('../middleware/JSONValidation')

module.exports = function (app) {
    app.disable('x-powered-by');

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin",  "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-auth-token");
        next();
    });

    app.use(express.urlencoded({extended:true}));
    app.use(express.json({limit:'1mb'}));
    app.use(JSONValidation);
    app.use(express.static('public'));
    app.use('/logs' ,express.static('logs' ));
    

    app.use(helmet());
    app.use(compression());
    
    const limiter = new rateLimit({
      store:  new RedisStore({expiry: 10 * 60}), // 10*60s = 10 min
      max:    100, // limit each IP to 100 requests per windowMs
      message:
              {status:'error',code:'429',msg:'درخواست های زیادی از این آی پی ارسال شده است، لطفا بعدا تلاش بفرمایید.',isDone:false}
    });

  
    app.use("/v1/",           limiter);
    app.use(                  httpLogger);
    app.use('/v1/users',      users);
    app.use('/v1/targets',    targets);
    app.use('/v1/results',    results);
    
    // 404
    app.use('*', (req, res) => {res.status('404').send({status:'error',code:'404',msg:'هیچ مسیری پیدا نشد',isDone:false})});
};