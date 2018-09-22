const Article = require('../models/article');
const mongodb = require('mongodb');
const User = require('../models/user');

module.exports = {
  create : function(req,res){
    const input = {
      title : req.body.title,
      body : req.body.body,
      user : req.userData.id
    };
    Article.create(input)
    .then(data=>{
      User.updateOne({
        _id : data.user
      },{
        $push : {
          articles : data._id
        }
      })
      .then(response=>{
        res.status(200).json({
          msg : "success adding article",
          data : data
        });
      })
      .catch(err=>{
        res.status(500).json({
          msg : "failed adding article",
          err : err
        });
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed adding article",
        err : err
      });
    });
  },

  remove : function(req,res){
    Article.findOne({
      _id : req.params.id
    })
    .then(data=>{
      data.remove();
      res.status( 200 ).json({
        msg : `success deleting article by id ${req.params.id}`,
        data : data
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed deleting article",
        err : err
      });
    });
  },

  update : function(req,res){
    Article.findOne({
      _id : req.params.id
    })
    .then(data=>{
      Article.updateOne({
        _id : req.params.id
      },{$set: {
        "title" : req.body.title || data.title ,
        "body" : req.body.body || data.body,
      }
      })
      .then(data=>{
        res.status( 200 ).json({
        msg : `success updating article by id ${req.params.id}`,
        data : data
      });
      })
      .catch(err=>{
        res.status(500).json({
          msg : "failed updating article",
          err : err
        });
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed deleting article",
        err : err
      });
    });
  },

  findAll : function(req,res){
    Article.find({})
    .populate({
      path :'comments',
      model :'Comment',
      populate :{
        path : 'user',
        model : 'User'
      }
    })
    .populate('user')
    .exec()
    .then(data=>{
      res.status( 200 ).json({
        msg : 'success finding articles',
        data : data
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed finding article",
        err : err
      });
    });
  },

  findOne : function(req,res){
    Article.find({
      _id : req.params.id
    })
    .populate({
      path :'comments',
      model :'Comment',
      populate :{
        path : 'user',
        model : 'User'
      }
    })
    .populate('user')
    .exec()
    .then(data=>{
      console.log(data);
      res.status( 200 ).json({
        msg : 'success finding aricle',
        data : data
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed finding article",
        err : err
      });
    });
  },
};