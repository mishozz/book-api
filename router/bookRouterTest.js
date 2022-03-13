//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';
import Book from '../model/books.js'

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    beforeEach((done) => { //Before each test we empty the database
        Book.deleteMany({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/GET book', () => {
      it('it should GET all the books', (done) => {
        chai.request(app)
            .get('/books')
            .end((_err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

   describe('/POST book', () => {
      it('it should POST a book', (done) => {
          let book = {
              isbn: "test-isbn",
              description: "test-description",
              availableCopies: 10
          }
        chai.request(app)
            .post('/books')
            .send(book)
            .end((_err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('isbn');
                res.body.should.have.property('description');
                res.body.should.have.property('availableCopies');
              done();
            });
      });
  });
  
});
