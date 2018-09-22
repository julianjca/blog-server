process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Article = require('../models/article');
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

describe('Articles', () => {
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

              Article.create({
                title : "Hello World",
                body : "Selamat Datang",
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

  describe('/GET showing all articles', () => {
    it('it should GET all the articles', (done) => {
      chai.request(server)
        .get('/articles')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.a('array');
            res.body.should.have.property('msg').eql('success finding articles');
          done();
        });
    });
  });

  describe('/POST creating an article', () => {
    it('it should create an article', (done) => {
      let article = {
        title : "Hello World",
        body : "Selamat Datang",
    };
      chai.request(server)
        .post('/articles')
        .send(article)
        .set('token', token1)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          //check property
          res.body.data.should.have.property('title');
          res.body.data.should.have.property('body');
          res.body.data.should.have.property('user');
          res.body.should.have.property('msg').eql('success adding article');
          done();
        });
    });
  });

  describe('/DELETE deleting an article', () => {
    it('it should delete an article by id', (done) => {
      chai.request(server)
        .delete(`/articles/${id}`)
        .set('token', token1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql(`success deleting article by id ${id}`);
          done();
        });
    });
  });

  describe('/PUT updating an article', () => {
    it('it should update an article by id', (done) => {
      const article = {
        title : "Helloooo",
        body : "Selamat Datang 123"
      };
      chai.request(server)
        .put(`/articles/${id}`)
        .send(article)
        .set('token', token1)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.have.property('msg').eql(`success updating article by id ${id}`);
          res.body.data.nModified.should.equal(1);
          res.body.data.ok.should.equal(1);
          done();
        });
    });
  });

  afterEach((done) => { //Before each test we empty the database
    Article.remove({}, (err) => {
       done();
    });
  });
});