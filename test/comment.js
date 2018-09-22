process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Comment = require('../models/comment');
let User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Chai
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
let chaiHttp = require('chai-http');
let server = require('../app.js');
chai.use(chaiHttp);

describe('Comments', () => {
  let id = '';
  let token1 = '';
  const password = "123456";

  beforeEach((done) => {
    User.create({
      name : "Tono",
      email : "tono@mail.com",
      password : password
    })
    .then(user=>{
      User.findOne({
        _id : user._id
      })
      .then(user2=>{
        const isPasswordValid = bcrypt.compareSync(password,user2.password);

        if(isPasswordValid){
          jwt.sign({
            email : user2.email,
            name : user2.name,
            id : user2._id
          }, process.env.JWT_SECRET,( err,token )=>{
            if( err ){
              console.log(err);
            }
            else{
              token1 = token;
              Comment.create({
                comment : "Hello World",
                user : user._id
              })
              .then(data=>{
                id = data._id;
                done();
              })
              .catch(err=>{
                console.log(err);
              });
            }
          });
        }

        else{
          console.log("haha");
        }
      })

      .catch(err=>{
        console.log(err);
      });

    })
    .catch(err=>{
      console.log(err);
    });
  });

  describe('/GET showing all comments', () => {
    it('it should GET all the comments', (done) => {
      chai.request(server)
        .get('/comments')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.a('array');
            res.body.should.have.property('msg').eql('success finding comments');
          done();
        });
    });
  });

  describe('/POST creating an comment', () => {
    it('it should create an comment', (done) => {
      let comment = {
        comment : "Hello World",
    };
      chai.request(server)
        .post('/comments')
        .send(comment)
        .set('token', token1)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          //check property
          res.body.data.should.have.property('comment');
          res.body.data.should.have.property('user');
          res.body.should.have.property('msg').eql('success adding comment');
          done();
        });
    });
  });

  describe('/DELETE deleting an comment', () => {
    it('it should delete an comment by id', (done) => {
      chai.request(server)
        .delete(`/comments/${id}`)
        .set('token', token1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql(`success deleting comment by id ${id}`);
          done();
        });
    });
  });


  afterEach((done) => { //Before each test we empty the database
    Comment.remove({}, (err) => {
      User.remove({}, err=>{
        done();
      })
    });
  });
});