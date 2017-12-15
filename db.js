const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://testsecuuser:fdsvsgsrtgrt@51.255.47.226/testsecudb';
const client = new pg.Client(connectionString);

var db = {
    connect: function() {
        client.connect()
    },
    createUser: function(login, password) {
        var query = "insert into usern values ('" + login + "', '" + password + "');";

        client.query(query, function (err, result) {
            if (err) {
                return false;
                // return console.error('error running query', err);
            }

            console.log(result);

            return true;
        });
    },
    login: function(login, password) {
        var query = "select * from usern where login = '" + login + "' and password = '" + password + "';";

        client.query(query, function (err, result) {
            if (err) {
                return false;
                // return console.error('error running query', err);
            }

            if (result.rowCount > 0) {
                var guid = result.rows[0].guid;

                return guid;
            }

            return null;
        });
    },
    createProductSerial: function(productuuid, serialuuid) {
        //var query = "select * from product where uuid = '" + productuuid + ";";
        var query = "insert into serial values ('" + productuuid + "', '" + serialuuid + "');";

        client.query(query, function (err, result) {
            if (err) {
                return false;
                // return console.error('error running query', err);
            }

            console.log(result);

            return true;
        });
    },
    searchProductWithSerial: function(serialuuid) {
        //var query = "select * from product where uuid = '" + productuuid + ";";
        var query = "select * from product where serial = '" + serialuuid + "';";

        client.query(query, function (err, result) {
            if (err) {
                return false;
            }

            console.log(result);

            if (result.rowCount > 0) {
                var productuuid = result.rows[0].productuuid;
                var query2 = "select * from product where productuuid = '" + productuuid + "';";

                client.query(query2, function (err, result) {
                    if (err) {
                        return false;
                    }

                    console.log(result);

                    if (result.rowCount > 0) {
                        console.log(result.rows[0]);

                        return result.rows[0];
                    }

                    return false;
                });
            }

            return false;
        });
    }
};

module.exports = db;