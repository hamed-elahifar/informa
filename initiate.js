const {User}    = require('./models/users');
const {Target}  = require('./models/targets');

require('./startup/db')();

(async ()=>{
    const user = new User ({
        name:       'hamed',
        password:   '123'
    })
    
    await user.save();
    
    
    let target = new Target ({ip:'8.8.8.8'})
    await target.save();

        target = new Target ({ip:'1.1.1.1'})
    await target.save();

        target = new Target ({ip:'4.2.2.2'})
    await target.save();

        target = new Target ({ip:'127.0.0.1'})
    await target.save();
    
})()