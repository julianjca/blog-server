const express = require('express');
const app = express();
const cors = require('cors');
const mongoose   = require('mongoose');

const users = require('./routes/users');
const articles = require('./routes/articles');
const comments = require('./routes/comments');

require('dotenv').config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routing
app.use('/users',users);
app.use('/articles',articles);
app.use('/comments',comments);

//Mongoose
let url = "";
if(process.env.NODE_ENV === 'test'){
  url = `mongodb://localhost:27017/test-blog-db`;
}
else{
  // url = `mongodb://admin:admin1234@ds159772.mlab.com:59772/blog`;
  url = `mongodb://localhost:27017/blog-db`;
}

mongoose.connect(url,{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected');
});

app.listen(port,()=>{
  console.log(`application is on port:${port}`);
});




module.exports = app;
