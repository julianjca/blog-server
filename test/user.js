process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let User = require('../models/user');

//Chai
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
let chaiHttp = require('chai-http');
let server = require('../app.js');
chai.use(chaiHttp);

describe('Users', () => {
  let id = '';
  beforeEach((done) => {
    User.create({
      name : "Tono",
      email : "tono@mail.com",
      password : '123456'
    })
    .then(data=>{
      id = data._id;
      done();
    })
    .catch(err=>{
      console.log(err);
    });
  });

  describe('/GET showing all users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
        .get('/users')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.a('array');
            res.body.should.have.property('msg').eql('success finding users');
          done();
        });
    });
  });

  describe('/POST creating a user', () => {
    it('it should create a users', (done) => {
      let user = {
        name: "Jimmy",
        email: "jim@mail.com",
        password: 123456
    };
      chai.request(server)
        .post('/users/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          //check property
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('password');
          res.body.should.have.property('msg').eql('success registering user');

          //check result
          res.body.data.name.should.equal('Jimmy');
          res.body.data.email.should.equal('jim@mail.com');
          res.body.data.password.should.not.equal('123456');
          done();
        });
    });
  });

  describe('/POST logging in a user', () => {
    it('it should log in a users', (done) => {
      let user = {
        email : "tono@mail.com",
        password : '123456'
      };
      chai.request(server)
        .post('/users/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          //check property
          res.body.should.have.property('token');
          res.body.should.have.property('msg').eql('login success');
          done();
        });
    });
  });

  describe('/DELETE deleting a user', () => {
    it('it should delete a user by id', (done) => {
      chai.request(server)
        .delete(`/users/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql(`success deleting user by id ${id}`);
          done();
        });
    });
  });

  describe('/PUT updating a user', () => {
    it('it should update a user by id', (done) => {
      const user = {
        name : "Bobi",
        email : "bobi@mail.com"
      };
      chai.request(server)
        .put(`/users/${id}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql(`success updating user by id ${id}`);
          res.body.data.nModified.should.equal(1);
          res.body.data.ok.should.equal(1);
          done();
        });
    });
  });

  afterEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
       done();
    });
  });
});