const router        = require('express').Router()
  ,  {Result}       = require('../models/results')
  ,   auth          = require('../middleware/auth')
  ,   admin         = require('../middleware/admin')


router.put('/:id',auth, async(req,res)=>{
});

router.get('/:id',[auth,admin], async(req,res)=>{
})

router.delete('/:id',[auth,admin], async(req,res)=>{
});



module.exports = router;