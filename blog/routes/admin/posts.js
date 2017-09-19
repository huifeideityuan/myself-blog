var express = require('express');
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/blog6";
const multiparty = require('multiparty'); //引入multiparty
const path = require('path');
const fs = require('fs');
var router = express.Router();
//以http://localhost:3000/admin/posts/开头的路径，就在这里处理
//显示文章列表
router.get('/', function(req, res, next) {
    //获取分页的相关参数
    let page = req.query.page || 1; //当前页
    let count = +req.query.count || 5; //每页显示的文章数
    let offset = (page - 1) * count; //偏移量
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let posts = db.collection('posts');
        posts.find().skip(offset).limit(count).sort({time : -1}).toArray((err,result) => {
            if (err) throw err;
            //获取总的文章数量
            posts.find().count().then( response => {
                let total = response;
                let size = Math.ceil(total / count);
                res.render('admin/article_list',{
                    data : result, //当前页的文章
                    page,
                    count,
                    size
                });
            }).catch( err => console.log(err));

        });
    });
});
//显示添加文章的表单页面
router.get('/add', function(req, res, next) {
    //获取所有的分类信息
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let category = db.collection('category');
        category.find().toArray((err,result) => {
            if (err) throw err;
             res.render('admin/article_add',{data : result});
        });
    });
});
//完成文章的插入操作
router.post("/insert",function(req,res){
    //实例化form对象
    let uploadDir = path.join(__dirname,'../../public/temp'); //设置保存文件的临时目录
    const form = new multiparty.Form({uploadDir});
    //使用form对象的parse对req对象进行解析
    form.parse(req,(err,fields,files) => {
        // console.log(fields);
        // console.log(files);
        //需要判断文件是否有上传
        if (files.cover[0].size) {
            //有上传
            let oldPath = files.cover[0].path;
            // console.log(__dirname);
            let newPath = path.join(__dirname,'../../public/uploads',files.cover[0].originalFilename);
            fs.rename(oldPath,newPath,(err) => {
                if (err) throw err;
                //保存成功了，需要将数据插入到数据库中
                let category = fields.category[0];
                let subject = fields.subject[0];
                let summary = fields.summary[0];
                let content = fields.content[0];
                // //需要获取当前时间
                let time = new Date().toLocaleString();
                // //需要设置一个浏览次数，随机一个
                let count = Math.ceil(Math.random() * 100);
                let cover = "/uploads/" + files.cover[0].originalFilename; //一定要使用相对路径

                //2.数据的有效性验证
                if (!subject) {
                    res.render("admin/message",{msg : '标题不能为空'});
                }
                //3.完成数据的插入
                MongoClient.connect(url,(err,db) => {
                    if (err) throw err;
                    let posts = db.collection('posts');
                    posts.insert({category,subject,summary,content,time,count,cover},(err,result) => {
                        if (err) throw err;
                        res.render('admin/message',{msg : '添加文章成功'});
                    });
                });
            });
        } else {
            //没有上传
            let category = fields.category[0];
            let subject = fields.subject[0];
            let summary = fields.summary[0];
            let content = fields.content[0];
            // //需要获取当前时间
            let time = new Date().toLocaleString();
            // //需要设置一个浏览次数，随机一个
            let count = Math.ceil(Math.random() * 100);
            let cover = "";
            //2.数据的有效性验证
            if (!subject) {
                res.render("admin/message",{msg : '标题不能为空'});
            }
            //3.完成数据的插入
            MongoClient.connect(url,(err,db) => {
                if (err) throw err;
                let posts = db.collection('posts');
                posts.insert({category,subject,summary,content,time,count,cover},(err,result) => {
                    if (err) throw err;
                    res.render('admin/message',{msg : '添加文章成功'});
                });
            });
        }

    });
    // console.log(req.body);
    //1.获取表单提交的数据
    // let category = req.body.category;
    // let subject = req.body.subject;
    // let summary = req.body.summary;
    // let content = req.body.content;
    // //需要获取当前时间
    // let time = new Date().toLocaleString();
    // //需要设置一个浏览次数，随机一个
    // let count = Math.ceil(Math.random() * 100);
    // //2.数据的有效性验证
    // if (!subject) {
    //     res.render("admin/message",{msg : '标题不能为空'});
    // }
    // //3.连接数据库，完成插入操作，并给出相应提示
    // MongoClient.connect(url,(err,db) => {
    //     if (err) throw err;
    //     let posts = db.collection('posts');
    //     posts.insert({category,subject,summary,content,time,count},(err,result) => {
    //         if (err) throw err;
    //         res.render('admin/message',{msg : '添加文章成功'});
    //     });
    // });
});
//显示编辑文章的表单页面
router.get('/edit', function(req, res, next) {
  res.render('admin/article_edit');
});
//完成文章的更新操作
router.post("/update",function(req,res){
    res.send('文章更新了');
});
//删除文章
router.get('/delete', function(req, res, next) {
  res.send("<h2>删除文章</h2>");
});
module.exports = router;
