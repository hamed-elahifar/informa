const mongoose       = require('mongoose')
  ,   Joi            = require('joi')
  ,   {sign}         = require('jsonwebtoken')
  ,   config         = require('config');
 
const userSchema = new mongoose.Schema({
    id: {
        type:String,
        default: function() {return Math.random().toString(35).substr(2, 5)},
        unique:true,
    },
    username: {
        trim:       true,
        type:       String,
        maxlength:  30,
        default:    '',
        // unique:     true,
        lowercase:  true
    },
    firstname: {
        trim:       true,
        type:       String,
        maxlength:  30,
        lowercase:  true
    },
    lastname: {
        trim:       true,
        type:       String,
        maxlength:  30,
        lowercase:  true
    },
    phone: {
        trim:       true,
        type:       String,
        // required:   true,
        minlength:  11,
        maxlength:  11,
        // length:  11,
        unique:     true,
    },
    email: {
        trim:       true,
        type:       String,
        // required:   true,
        minlength:  0,
        maxlength:  255,
        // unique:     true,
        default:    '',
        lowercase:  true
    },
    isEmailActive:  {
        type:       Boolean,
        default:    false
    },
    password: {
        type:       String,
        required:   true,
        minlength:  3,
        maxlength:  1024,
        required:   true
    },
    role: {
        trim:       true,
        type:       [String],
        enum:       ['admin','oprator','client','interviewer','user'],
        default:    'user'
    },
    opration:{
        trim:       true,
        type:       [String],
        enum:       ['create', 'read', 'update', 'delete'],
        lowercase:  true
    },
    isActive: {
        type:       Boolean,
        default:    false
    },
    enable: {
        type:       Boolean,
        default:    true
    },
    deleted:        {type:Date,default:null},
},{timestamps:true});
 
function profileValidation(req,res,next) {

    let request            = {};
        request.firstname  = req.body.firstname;
        request.lastname   = req.body.lastname;
        request.email      = req.body.email;
          
    const schema = {
        firstname:Joi.string().min(3).max(33).optional()                          .label('فرمت وارد شده صحیح نیست'),
        lastname: Joi.string().min(3).max(33).optional()                          .label('فرمت وارد شده صحیح نیست'),
        email:    Joi.string().min(6).max(50).optional().email({minDomainAtoms:2}).label('فرمت وارد شده صحیح نیست'),
    }
 
    const {error} = Joi.validate(request, schema,{abortEarly: false});
    if (error) return res.status(400).send(error);
    next();
};
  
userSchema.methods.generateAuthToken = function() {
    return sign({ id :this.id,
                 _id :this._id,
                 role:this.role 
                }, 
                 config.get('jwt'));
}
 
userSchema.methods.generateVerifyCode = function() {
    return Math.floor(Math.random() * (99999 - 10000) + 10000);
}
 
function registraionVadition(reqReg) {
    const schema = {
          username:         Joi.string().min(5).max(15).required().label('نام کاربری باید بین 5 تا 15 کاراکتر باشد'),
          password:         Joi.string().min(3).required().label('ساختار پسورد صحیح نیست'),//.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{3,})/)
    }
    return Joi.validate(reqReg, schema,{abortEarly: false});
};
 
function verifyCode(req){
    const schema = {
        phone:      Joi.string().min(11).max(11).required().label('ساختار شماره موبایل صحیح نیست'),
        code:       Joi.string()        .max(5) .required().label('ساختار کد صحیح نیست'),
    }
    return Joi.validate(req,schema,{abortEarly:false})
}
 
const User                  = mongoose.model('users', userSchema);

exports.registraionVadition = registraionVadition;
exports.profileValidation   = profileValidation;
exports.verifyCode          = verifyCode;
exports.User                = User;
