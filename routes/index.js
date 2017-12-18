var express = require('express');
var router = express.Router();
var QRCode = require('qrcode');
const uuidv1 = require('uuid/v1');
var sockets = require('./../sockets.js');
var db = require('./../db.js');

//===================== Testing =====================

router.get('/', function (req, res, next) {
    res.json({message: 'plop'});
});


router.get('/createqrcode', function (req, res, next) {
    QRCode.toDataURL('I am a pony!', function (err, url) {
        console.log(url);

        res.json({qrcode: url});
    });
});

router.get('/test/:login/:password', function (req, res, next) {

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

//==========================================


//===================== User =====================

//create user
router.post('/user', function (req, res, next) {
    //var bear = new Bear();      // create a new instance of the Bear model

    var login = req.body.login;
    var password = req.body.password;

    db.createUser(login, password, function() {
        res.status(200).json();
    }, function() {
        res.status(404).json();
    });
});

//login user
router.get('/user/:login/:password', function (req, res, next) {
    var login = req.params.login;
    var password = req.params.password;

    var result = db.login(login, password);

    if (result) {
        res.status(200).json({guid: result});
    } else {
        res.status(404).json();
    }
});

//===================== Product =====================

//create a client and return the created uuid for communicating whith socket
router.get('/auth', function (req, res, next) {
    var clientuuid = uuidv1();

    sockets.addClient(clientuuid);

    console.log(clientuuid);

    res.json({uuid: clientuuid});
});

router.get('/product-serial', function (req, res, next) {
    var serialuuid = uuidv1();

    db.createProductSerial(serialuuid);

    //var bypass = "http://51.255.47.226:3000/buy/" + uuid + "/" + guid;

    res.json({serialuuid: serialuuid});
});

router.get('/product-serial-qrcode/:clientuuid', function (req, res, next) {
    var clientuuid = req.params.clientuuid;
    var serialuuid = uuidv1();

    db.createProductSerial(clientuuid, serialuuid);

    //var bypass = "http://51.255.47.226:3000/buy/" + serialuuid + "/" + clientuuid;

    QRCode.toDataURL(serialuuid, function (err, data) {
        console.log(data);

        res.json({qrcode: data, serialuuid: serialuuid});
    });
});

router.get('/buy/:serialuuid', function (req, res, next) {
    var serialuuid = req.params.serialuuid;

    var clientuuid = db.searchClientWithSerial(serialuuid, function(clientuuid) {
        var socket = sockets.searchSocket(clientuuid);

        socket.emit('buy', serialuuid);

        res.status(200).json();
    });


});

// router.get('/buy/:serialuuid/:clientuuid', function (req, res, next) {
//     var serialuuid = req.params.serialuuid;
//     var clientuuid = req.params.clientuuid;
//
//     var result = db.searchProductWithSerial(serialuuid);
//
//     var socket = sockets.searchSocket(clientuuid);
//
//     socket.emit('buy', serialuuid);
//
//     if (result) {
//         res.status(200).json(result);
//     } else {
//         res.status(404).json();
//     }
// });

module.exports = router;
