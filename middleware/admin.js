
module.exports = function(req, res, next) {


    // req.userinfo
    // 401 Unauthorized
    // 403 Forbidden    
    
    if (!req.userinfo || !req.userinfo.role) return res.status(403).send({status:'error',code:'403',msg:'دسترسی برای این کاربر محدود است',isDone:false})

    const admin = req.userinfo.role.includes("admin");
    if (!admin) return res.status(403).send({status:'error',code:'403',msg:'دسترسی برای این کاربر محدود است',isDone:false});
    
    next();  
};