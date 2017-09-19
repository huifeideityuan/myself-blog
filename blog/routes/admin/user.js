var express = require('express');
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/blog6";

//显示登录页面
router.get('/login', function(req, res, next) {
  res.render('admin/login');
});
//验证用户登录操作
router.post('/signin',(req,res) => {
    //1.获取表单提交的数据
    let username = req.body.username.trim();
    let password = req.body.password.trim();
    //2.验证数据的有效性
    if (username == '' || password == '' ){
        res.render('admin/message',{msg : '用户名或密码不能为空'});
        return;
    }
    //3.连接数据库，完成验证并给出提示
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let user = db.collection('user');
        user.findOne({username,password},(err,result) => {
            if (err) throw err;
            //需要对result进行判断,如果找不到，result是为空的
            if (result) {
                //登录成功,保存登录成功的标识--isLogin，然后再跳转
                req.session.isLogin = 1;
                res.redirect('/admin');
            } else {//失败了
                res.redirect('/user/login');
            }
        });
    });
});

//注销用户
router.get('/logout',(req,res) => {
    delete req.session.isLogin; //删除session信息
    res.redirect('/admin'); //跳转
});
module.exports = router;
