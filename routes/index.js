var express = require('express');
var router = express.Router();
var QRCode = require('qrcode');
const uuidv1 = require('uuid/v1');
var sockets = require('./../sockets.js');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({message: 'plop'});
});


router.get('/test', function (req, res, next) {
    var bool = false;
    var myurl = "";


    QRCode.toDataURL('I am a pony!', function (err, url) {
        console.log(url);


        myurl = url;

        res.json({message: myurl});
        bool = true;
    });


});

router.get('/user/:login/:password', function (req, res, next) {

    if (req.params.login === "plop" && req.params.password === "plop") {
        res.status(200).json();
    }

    res.status(404).json();

});


router.get('/product/:name/:price/:img/:guid', function (req, res, next) {
    var name = req.params.name;
    var price = req.params.price;
    var img = req.params.img;
    var guid = req.params.guid;
    var uuid = uuidv1();

    var data = name + ":" + price + ":" + img;

    //bdd access
    const pg = require('pg');
    const connectionString = process.env.DATABASE_URL || 'postgres://testsecuuser:fdsvsgsrtgrt@51.255.47.226/testsecudb';

    const client = new pg.Client(connectionString);
    client.connect();
    //client.query('SELECT $1::int AS number from test', ['1'], function(err, result) {

    var bypass = "http://51.255.47.226:3000/buy/" + uuid + "/" + guid;

    QRCode.toDataURL(bypass, function (err, url) {
        console.log(url);

        client.query("insert  into product (name, price, img, qrcode, serial) values ('" + name + "', '" + price + "','" + img + "','" + url + "','" + uuid + "');", function (err, result) {

            if (err) {
                return console.error('error running query', err);
            }

            res.json({qrcode: url});
            //output: 1
        });
    });
});

router.get('/buy/:uuid/:guid', function (req, res, next) {
    var uuid = req.params.uuid;
    var guid = req.params.guid;
    //bdd access
    const pg = require('pg');
    const connectionString = process.env.DATABASE_URL || 'postgres://testsecuuser:fdsvsgsrtgrt@51.255.47.226/testsecudb';

    const client = new pg.Client(connectionString);
    client.connect();
    //client.query('SELECT $1::int AS number from test', ['1'], function(err, result) {

    client.query("select * from product where serial = '" + uuid + "'", function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }


        if(result.rowCount > 0) {
            console.log(result[0].name);
            var name = result[0].name;
            for (value in sockets) {
                if (sockets[value].guid === guid) {
                    sockets[value].socket.emit('buy', name);
                }
            }
            res.status(200).json("objet acheté");
        }

        res.status(404).json(null);
    });
});

module.exports = router;
