var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var app = express();

app.use(session({
    secret: 'blog',
    resave: false,
    saveUninitialized: true,
    cookie: { }
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));

var index = require('./routes/home/index');
app.use('/', index);

//引入posts.js
const posts = require('./routes/home/posts');
//针对/posts，使用posts这个中间件
app.use("/posts",posts);

const list = require('./routes/home/list');
app.use("/list",list);
//后台登录判断
app.use("/admin",(req,res,next) => {
    //判断session中是否有isLogin
    if (req.session.isLogin) {
        //已经登录了，放行
        next();
    } else {
        //没有登录
        res.redirect('/user/login');
    }
});

const admin = require('./routes/admin/index');
app.use("/admin",admin);

const category = require('./routes/admin/category');
app.use("/admin/category",category);

const article = require('./routes/admin/posts');
app.use('/admin/posts',article);

const user = require('./routes/admin/user');
app.use("/user",user);

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
  res.render('error');
});

module.exports = app;
