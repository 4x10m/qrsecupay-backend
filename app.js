var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var sockets = require('./sockets.js');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.use(cors());
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

http.listen(3001);

io.on('connection', function(socket){

    socket.on('hello', function(msg){

        sockets.push({ socket: socket, guid: msg });
        console.log('message: ' + msg);
    });


});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;


