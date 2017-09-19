var express = require('express');
var router = express.Router();
const ObjectId = require('objectid');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";

//引入category模型
const Category = require('../../models/category');

//以http://localhost:3000/admin/category/开头的路径，就在这里处理
//显示分类列表
router.get('/', function(req, res, next) {
    //调用模型获取分类数据
    Category.getCats((err,result) => {
        if (err) throw err;
        res.render('admin/category_list',{data : result});
    });
    //获取分类数据
    // MongoClient.connect(url,(err,db) => {
    //     if (err) throw err;
    //     let category = db.collection('category');
    //     category.find().sort({order : -1}).toArray((err,result) => {
    //         if (err) throw err;
    //         //渲染模板
    //         res.render('admin/category_list',{data : result});
    //     });
    // });
});
//显示添加分类的表单页面
router.get('/add', function(req, res, next) {
  res.render('admin/category_add');
});
//完成分类的插入操作
router.post("/insert",function(req,res){
    //获取表单提交的数据
    let title = req.body.title.trim();
    let order = req.body.order.trim();
    //验证数据的有效性
    if (!title) {
        res.render('admin/message',{msg : '分类名称不能为空'});
        return;
    }
    if (!(+order == order)) {
        res.render('admin/message',{msg : '排序依据必须是数字'});
        return;
    }
    //调用模型完成数据库的插入操作
    //实例化一个category对象
    let cat = new Category(title,order);
    cat.add((err,result) => {
        if (err) throw err;
        // 插入成功了
        res.render('admin/message',{msg : '添加分类成功'});
    });
    //连接数据库，完成插入操作
    // MongoClient.connect(url,(err,db) => {
    //     if (err) throw err;
    //     let category = db.collection('category');
    //     category.insert({title,order},(err,result) => {
    //         if (err) throw err;
    //         //插入成功了
    //         res.render('admin/message',{msg : '添加分类成功'});
    //     });
    // });
});
//显示编辑分类的表单页面
router.get('/edit', function(req, res, next) {
    let id = req.query.id;
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let category = db.collection('category');
        category.findOne({_id : ObjectId(id)},(err, result) => {
            if (err) throw err;
            console.log(result);
            res.render('admin/category_edit',{data : result});
        });
    });
});
//完成分类的更新操作
router.post("/update",function(req,res){
    //获取表单提交的数据
    let title = req.body.title.trim();
    let order = req.body.order.trim();
    let id = req.body.id;
    //验证数据有效性
    //验证数据的有效性
    if (!title) {
        res.render('admin/message',{msg : '分类名称不能为空'});
        return;
    }
    if (!(+order == order)) {
        res.render('admin/message',{msg : '排序依据必须是数字'});
        return;
    }
    //连接数据库完成更新操作
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let category = db.collection('category');
        category.update({_id : ObjectId(id)},{title,order},(err,result) => {
            if (err) throw err;
            //更新成功了
            res.render('admin/message',{msg : '更新分类成功'});
        });
    });
});
//删除分类
router.get('/delete', function(req, res, next) {
    //获取id
    let id = req.query.id;
    MongoClient.connect(url,(err,db) => {
        if (err) throw err;
        let category = db.collection('category');
        category.remove({_id : ObjectId(id)},(err,result) => {
            if (err) throw err;
            res.render("admin/message",{msg : '删除分类成功！'});
        });
    });
});
module.exports = router;
