let path = require('path');
let router = require('express').Router();

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../../client/admin/index.html'));
});

module.exports = router;