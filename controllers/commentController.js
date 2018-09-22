const Comment = require('../models/comment');
const mongodb = require('mongodb');
const User = require('../models/user');
const Article = require('../models/article');


module.exports = {
  create : function(req,res){
    const input = {
      comment : req.body.comment,
      user : req.userData.id
    };
    Comment.create(input)
    .then(data=>{
      User.updateOne({
        _id : data.user
      },{
        $push : {
          comments : data._id
        }
      })
      .then(response=>{
        Article.updateOne({
          _id : req.body.postId
        },{
          $push : {
            comments : data._id
          }
        })
        .then(response=>{
          res.status(200).json({
            msg : "success adding comment",
            data : data
          });
        })
        .catch(err=>{
          console.log(err);
        })
      })
      .catch(err=>{
        res.status(500).json({
          msg : "failed adding comment",
          err : err
        });
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed adding comment",
        err : err
      });
    });
  },

  remove : function(req,res){
    Comment.findOne({
      _id : req.params.id
    })
    .then(data=>{
      data.remove();
      res.status( 200 ).json({
        msg : `success deleting comment by id ${req.params.id}`,
        data : data
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed deleting comment",
        err : err
      });
    });
  },

  update : function(req,res){
    Comment.findOne({
      _id : req.params.id
    })
    .then(data=>{
      Comment.updateOne({
        _id : req.params.id
      },{$set: {
        title : req.body.title || data.title,
        body : req.body.body || data.body,
      }})
      .then(data=>{
        res.status( 200 ).json({
        msg : `success updating comment by id ${req.params.id}`,
        data : data
      });
      })
      .catch(err=>{
        res.status(500).json({
          msg : "failed updating comment",
          err : err
        });
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed deleting comment",
        err : err
      });
    });
  },

  findAll : function(req,res){
    Comment.find({})
    .populate('user')
    .exec()
    .then(data=>{
      res.status( 200 ).json({
        msg : 'success finding comments',
        data : data
      });
    })
    .catch(err=>{
      res.status(500).json({
        msg : "failed finding comments",
        err : err
      });
    });
  }
};