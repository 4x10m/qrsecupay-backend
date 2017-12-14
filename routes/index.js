var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({ message: 'plop'});
});


router.get('/test', function(req, res, next) {
    var bool = false;
    var myurl = "";
    var QRCode = require('qrcode');

    QRCode.toDataURL('I am a pony!', function (err, url) {
        console.log(url);


        myurl = url;

        res.json({ message: myurl});
        bool = true;
    });




});


module.exports = router;
