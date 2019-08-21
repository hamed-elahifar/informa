const router            = require('express').Router()
  ,  {Target}           = require('../models/targets')
  ,   auth              = require('../middleware/auth')
  ,   admin             = require('../middleware/admin')


router.post('/',auth, async(req,res)=>{
    const target = new Target({
        ip:         req.body.ip,
        fqdn:       req.body.fqdn,
        status:     req.body.status,
        user:       req.userinfo._id
    });
    const result = await target.save();
    res.json(result);
});

router.put('/:id',auth, async(req,res)=>{
    let target = await Target.findOne({id:req.params.id})
    if (!target) return res.send({status:'error',code:'404',msg:'هدف با آی دی ارسالی یافت نشد',isDone:false});

    // ip      = req.body.ip       ||   target.ip
    // fqdn    = req.body.fqdn     ||   target.fqdn
    // status  = req.body.status   ||   target.status

    target = {
        ip:         req.body.ip,
        fqdn:       req.body.fqdn,
        status:     req.body.status,
        user:       req.userinfo._id
    };
    const result = await target.save();
    res.json(result);
});

router.get('/all',[auth,admin], async(req,res)=>{
    const result = await Target.find({});
    res.send(result);
})

router.delete('/:id',[auth,admin], async(req,res)=>{
    let result = await Target.findOne({id:req.params.id})
    if (!result) return res.send({status:'error',code:'404',msg:'هدف با آی دی ارسالی یافت نشد',isDone:false});

    if (result.deleted == null){
        result = await Target.findOneAndUpdate({id:req.params.id},{$set:{deleted:Date.now()}});
        return res.json({status:'success',code:'200',msg:'حذف هدف انجام شد',isDone:true})
    }
    if (result.deleted != null){
        result = await Target.findOneAndUpdate({id:req.params.id},{$set:{deleted:null}});
        return res.json({status:'success',code:'200',msg:'هدف حذف شده با موفقیت ریکاور شد',isDone:true})
    }
});

module.exports = router;