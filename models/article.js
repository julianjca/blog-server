const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const articleSchema = new Schema({
    title:{
        type: String
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    body : {
      type : String,
    },
    comments : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Comment'
    }]
},{
    timestamps: true
});



const Article = mongoose.model('Article', articleSchema);
articleSchema.pre('remove', function(next) {
    // User.remove({ person: this._id }, next);
    User.update({ _id: this.user }, { "$pull": { "articles": this._id }},function(err, obj) {
        next();
    });
});
module.exports = Article;