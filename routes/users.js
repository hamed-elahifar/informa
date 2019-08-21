const router                        = require('express').Router()
  ,  {User,
      profileValidation,
      registraionVadition}          = require('../models/users')
  ,   bcrypt                        = require('bcryptjs')
  ,   auth                          = require('../middleware/auth')
  ,   admin                         = require('../middleware/admin')
  ,   Joi                           = require('joi')


router.get('/me', auth, async(req,res)=>{
    const user = await User
        .findById(req.userinfo._id)
        .select('-password -__v -deleted -isEmailActive');

    res.json(user);
});

router.put('/me',[auth,profileValidation], async(req,res)=>{

    // const {error} = profileValidation(req.body);
    // if (error) return res.status(400).send(error);
    
    const user           = await User.findById(req.userinfo._id);
    const duplicateEmail = await User.findOne({email:req.body.email});

    if (duplicateEmail){
        if (duplicateEmail.email !== user.email)
            return res.status(400).send({status:'error',code:'400',msg:'این ایمیل متعلق به کاربر دیگری در سیستم می باشد',isDone:false});
    } else if (req.body.email && req.body.email.length > 0) {
        user.verifyCode = user.generateVerifyCode()
    }

    if (req.body.firstname)        user.firstname=        req.body.firstname
    if (req.body.lastname)         user.lastname=         req.body.lastname
    if (req.body.email)            user.email=            req.body.email
    
    try{
        const {id,firstname,lastname,email} = await user.save();
        res.json({id,firstname,lastname,email});
    }
    catch(ex){
        res.status(500).send(ex.message);
    }
});

router.put('/:id',[auth,admin], async(req,res)=>{
    
    const user = await User.findOne({id:req.params.id});
    if (!user) return res.status(404).send({status:'error',code:'404',msg:'کاربر یافت نشد',isDone:false})

        
    if (req.body.firstname)        user.firstname=          req.body.firstname
    if (req.body.lastname)         user.lastname=           req.body.lastname
    if (req.body.email)            user.email=              req.body.email
    if (req.body.role)             user.role=               req.body.role

    try{
        const result = await user.save();
        res.json(result);
    }
    catch(ex){
        res.status(500).json(ex.message);
    }
});

router.get('/:id',[auth,admin], async(req,res)=>{
    const user = await User
        .findOne({id:req.params.id})
        .select('-password -__v')
        
    res.json(user);
})

router.delete('/:id',[auth,admin], async(req,res)=>{
    let result = await User.findOne({id:req.params.id})
    if (!result) return res.send({status:'error',code:'404',msg:'کاربر با آی دی ارسالی یافت نشد',isDone:false});

    if (result.deleted == null){
        result = await User.findOneAndUpdate({id:req.params.id},{$set:{deleted:Date.now()}});
        return res.json({status:'success',code:'200',msg:'حذف کاربر انجام شد',isDone:true})
    }
    if (result.deleted != null){
        result = await User.findOneAndUpdate({id:req.params.id},{$set:{deleted:null}});
        return res.json({status:'success',code:'200',msg:'کاربر حذف شده با موفقیت ریکاور شد',isDone:true})
    }
});

router.post('/registration', async(req,res)=>{
    
    const { error } = registraionVadition(req.body);
    if (error) return res.status(400).send(error);

    // find User
    let user = await User.findOne({ phone: req.body.phone });
    if (user) return res.status(400).send({status:'error',code:'409',msg:'این کاربر قبلا ثبت نام کرده است',isDone:false});
    
    // Create User & send back the result.
    try{
        const verifyCode   = Math.floor(Math.random() * (99999 - 10000) + 10000)

        const salt         = await bcrypt.genSalt(10);
        const hashed       = await bcrypt.hash(req.body.password, salt);

        const registration = new User({
            username:      req.body.username,
            password:      hashed,
            isActive:      false,
            verifyCode:    verifyCode,
        });
        
        const {username,email,id} = await registration.save();
        res.json({id,username,msg:'registration successful'});
        
    }catch(ex){res.status(500).send(ex)}

});

router.post('/login', async(req, res) => {
    
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({phone: req.body.phone});
    if (!user) return res.status(400).send({status:'error',code:'400',msg:'شماره موبایل و یا رمز عبور صحیح نیست',isDone:false});

    // if (!user.enable) return res.status(403).send({status:'error',code:'403',msg:'این کاربر غیر فعال است',isDone:false});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({status:'error',code:'400',msg:'شماره موبایل و یا رمز عبور صحیح نیست',isDone:false});
    
    // if (user.isActive == false) return res.status(400).send({status:'error',code:'400',msg:'شماره موبایل کاربر فعال نیست',isDone:false});
    
    const token = user.generateAuthToken();
    
    res.header('x-auth-token', token);
    res.json({
        'status':       'success',
        'x-auth-token':  token,
        'isDone':        true
    });
});

function validateLogin(loginRequest) {
    const {username,password} = loginRequest
    const schema = {
        username:   Joi.string().min(5).max(15).required().label('ساختار نام کاربری صحیح نیست'),
        password:   Joi.string().min(3).max(15).required().label('ساختار رمز عبور صحیح نیست'),
    }
    return Joi.validate({username,password}, schema);
}

module.exports = router;