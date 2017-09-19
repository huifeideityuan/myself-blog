//分类模型
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('objectid');
const url = "mongodb://localhost:27017/blog6";
//定义一个类
class Category{
    //构造器
    constructor(title,order){
        this.title = title;
        this.order = order;
    }
    //添加分类
    add(callback){
        MongoClient.connect(url,(err,db) => {
            if (err) {
                return callback(err);
            }
            let category = db.collection('category');
            category.insert({title : this.title,order :this.order},(err,result) => {
                return callback(err,result);
            });
        });
    }
}
//获取所有的分类
Category.getCats = function(callback){
    //获取分类数据
    MongoClient.connect(url,(err,db) => {
        if (err) {
            return callback(err);
        }
        let category = db.collection('category');
        category.find().sort({order : -1}).toArray((err,result) => {
            return callback(err,result);
        });
    });
}
//导出Category
module.exports = Category;
