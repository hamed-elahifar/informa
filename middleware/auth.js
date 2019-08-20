const jwt           = require('jsonwebtoken')
  ,   config        = require('config');

module.exports = async function (req, res, next) {
    
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({status:'error',code:'401',msg:'دسترسی ممنوع، توکن ارسال نشده است',isDone:false});

    try {
        const decoded = jwt.verify(token, config.get('jwt'));
        req.userinfo  = decoded;

        // const user = await User.findById(req.userinfo._id);
        // if(!user) return res.status(500).send('500 Internal Server Error.');

        return next(); 
    } catch (ex) {
        res.status(400).send({status:'error',code:'400',msg:'توکن نامعتبر',isDone:false});
    }
};