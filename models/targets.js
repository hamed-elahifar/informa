const mongoose          = require('mongoose')

const targetSchema = new mongoose.Schema({
    id: {       type:    String,
                default: function() {return Math.random().toString(35).substr(2,5)},
                unique:  true},
    ip:         {type:String,unique:[true,'این آی پی از پیش در سیستم ثبت شده است.']},
    fqdn:       {type:String,unique:[true,'این لینک از پیش در سیستم ثبت شده است.']},
    status:     {type:       String,
                enum:        ['active','stop','pause','suspend'],
                lowercase:   true,
                trim:        true},
    state:      {type:       String,
                enum:        ['up','warn','error'],
                lowercase:   true,
                trim:        true},
    user:       {type:       mongoose.Schema.Types.ObjectId,
                ref:         'users'},
    interval:   {type:Number,default:1},
    deleted:    {type:Date,defult:null},
},{timestamps: true});


Target          = mongoose.model('targets', targetSchema);
exports.Target  = Target


