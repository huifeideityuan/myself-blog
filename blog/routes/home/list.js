var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";

router.get("/",(req,res) => {
    //获取cat
    let cat = req.query.cat;
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let category = db.collection('category');
        let posts = db.collection('posts');
        category.find().toArray((err,result1) => {
            if (err) throw err;
            posts.find({category : cat}).toArray((err,result2) => {
                if (err) throw err;
                //热门文章
                posts.find().sort({count : -1}).limit(10).toArray((err,result3) => {
                    if (err) throw err;
                    res.render('home/list',{cats:result1,posts:result2,hot:result3});
                });
            });

        });


    });
});
module.exports = router;
