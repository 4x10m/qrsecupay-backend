var express = require('express');
var router = express.Router();
var QRCode = require('qrcode');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({ message: 'plop'});
});


router.get('/test', function(req, res, next) {
    var bool = false;
    var myurl = "";


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


router.get('/product/:name/:price/:img', function(req, res, next) {
    var name = req.params.name;
    var price = req.params.price;
    var img = req.params.img;

    var data = name + ":" + price + ":" + img;

    //bdd acces
    const pg = require('pg');
    const connectionString = process.env.DATABASE_URL || 'postgres://testsecuuser:fdsvsgsrtgrt@51.255.47.226/testsecudb';

    const client = new pg.Client(connectionString);
    client.connect();
    //client.query('SELECT $1::int AS number from test', ['1'], function(err, result) {
    client.query('SELECT *  from test', function(err, result) {
        //call `done()` to release the client back to the pool


        if(err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].test);
        //output: 1
    });

    // QRCode.toDataURL(data, function (err, url) {
    //     console.log(url);
    //
    //     res.json({ qrcode: url});
    // });
});

module.exports = router;
