const router            = require('express').Router()
  ,  {Target}           = require('../models/targets')
  ,   auth              = require('../middleware/auth')
  ,   admin             = require('../middleware/admin')


router.put('/:id',auth, async(req,res)=>{
});

router.get('/:id',[auth,admin], async(req,res)=>{
})

router.delete('/:id',[auth,admin], async(req,res)=>{
    let result = await User.findOne({id:req.params.id})
    if (!result) return res.send({status:'error',code:'404',msg:'پرسشنامه با آی دی ارسالی یافت نشد',isDone:false});

    if (result.deleted == null){
        result = await User.findOneAndUpdate({id:req.params.id},{$set:{deleted:Date.now()}});
        return res.json({status:'success',code:'200',msg:'حذف کاربر انجام شد',isDone:true})
    }
    if (result.deleted != null){
        result = await User.findOneAndUpdate({id:req.params.id},{$set:{deleted:null}});
        return res.json({status:'success',code:'200',msg:'کاربر حذف شده با موفقیت ریکاور شد',isDone:true})
    }
});




module.exports = router;