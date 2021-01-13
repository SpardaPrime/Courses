if(process.env.START){
    module.exports = require('./key.prod');
}else{
    module.exports = require('../key_dev/key-dev');
}