const router        = require('express').Router()
  ,  {Result}       = require('../models/results')
  ,   auth          = require('../middleware/auth')
  ,   admin         = require('../middleware/admin')


router.get('/:ip/:date/:hour', async(req,res)=>{
  const result = await Result.findOne({
    ip:   req.params.ip  ,
    date: req.params.date,
    hour: req.params.hour,
  });
  res.send(result);
})




module.exports = router;