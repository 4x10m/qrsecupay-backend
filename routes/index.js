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

router.get('/user/:login/:password', function(req, res, next) {

    if (req.params.login === "plop" && req.params.password === "plop") {
        res.status(200).json();
    }

    res.status(404).json();

});

module.exports = router;
