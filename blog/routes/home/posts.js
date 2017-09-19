var express = require('express');
var router = express.Router();
const ObjectId = require('objectid');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";

//引入markdown
const markdown = require('markdown').markdown;

router.get('/', function(req, res, next) {
    //获取id
    let id = req.query.id;
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let category = db.collection('category');
        let posts = db.collection('posts');
        //同时，需要更新当前文章的count属性，使其+1
        posts.update({_id : ObjectId(id)},{$inc : {count : 1}},(err,result) => {
            if (err) throw err;
            category.find().toArray((err,result1) => {
                if (err) throw err;
                posts.findOne({_id : ObjectId(id)},(err,result2) => {
                    if (err) throw err;
                    //试图在此处，先将result2.content转成html
                    // result2.content = markdown.toHTML(result2.content);
                    res.render('home/posts',{cats : result1,data : result2});
                });
            });
        });
    });
});

//markdown的语法测试
router.get('/md',(req,res) => {
    let str = markdown.toHTML("这是一个[markdown](https://github.com/evilstreak/markdown-js)语法的内容");
    res.send(str);
});
module.exports = router;
