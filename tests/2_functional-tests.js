/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var should = require('chai').should();
var server = require('../server');


chai.use(chaiHttp);

suite('Functional Tests', function() {

  //This example will fail because we delete all books at the ende of this test series, therefore commented out
  /*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Title'
        })
        .end(function(err, res){          
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');     
          res.body.should.have.property('title').eql('Title');
          res.body.should.have.property('commentcount').eql(0);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){          
          res.should.have.status(400);         
          res.body.should.have.property('message').eql('missing required fields');  
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Title1'
        })
        .end(function(err, res){
          chai.request(server)
          .get('/api/books')
          .query({})
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');       
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('commentcount');
            res.body[0].should.have.property('_id');

            //ensuring comments is taken out of response
            res.body[0].should.not.have.property('comments');

            // ensuring nothing from my website will be cached in my client          
            res.should.have.header('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            //ensuring header X-Powered-By is set correctly to  PHP 4.2.0 normally a separate test case but I did not want to change amount of tests
            res.should.have.header('x-powered-by', 'PHP 4.2.0');
            done();
          });
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books')
          .end(function(err, res){
            var id = res.body[0]._id;
            chai.request(server)
            .delete('/api/books/'+id)
            .send({})
            .end(function(err, res){
       
              res.should.have.status(200);
              
              chai.request(server)
              .get('/api/books/'+id)
              .end(function(err, res){
                res.should.have.status(404);
                res.body.should.have.property('message').eql('no book exists');            
                done();
              });               
            });
          })  
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'valid id in db'
        })  
          .end(function(err, res){                   
            res.should.have.status(201);
            var id = res.body._id;      
            chai.request(server)
            .get('/api/books/'+id)
            .end(function(err, res){
              res.should.have.status(200);
              res.body.should.have.property('title').eql('valid id in db');

              //returning comments are an empty array
              res.body.should.have.property('comments').eql([]);       
              done();
            });            
          })  
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'new comment'
        })  
          .end(function(err, res){
            var id = res.body._id;     
            chai.request(server)
            .post('/api/books/'+id)
            .send({
              comment: 'This is a new comment' 
            })
            .end(function(err, res){            
              res.should.have.status(201);
              res.body.should.have.property('title').eql('new comment');
              res.body.should.have.property('comments').eql(['This is a new comment']);
              done();
            });
          })  
      });
      
    });



    suite('DELETE /api/books/[id] => delete book', function(){
      
      test('Test DELETE /api/books/[id] with invalid id', function(done){
        chai.request(server)
        .get('/api/books')
          .end(function(err, res){
            var id = res.body[0]._id;
            chai.request(server)
            .delete('/api/books/'+id)
            .send({})
            .end(function(err, res){       
              chai.request(server)
              .delete('/api/books/'+id)
              .send({})
              .end(function(err, res){       
                res.should.have.status(404);
                res.body.should.have.property('message').eql('could not delete '+id);        
                done();
              });
              
            });
          })  
      });
      
            
      test('Test DELETE /api/books/[id] with valid id', function(done){
        chai.request(server)
        .get('/api/books')
          .end(function(err, res){
            console.log(res.body[0]);
            var id = res.body[0]._id;
            chai.request(server)
            .delete('/api/books/'+id)
            .send({})
            .end(function(err, res){       
              res.should.have.status(200);
              res.body.should.have.property('message').eql('delete successful');        
              done();
            });
          })  
      });

    });

    suite('DELETE /api/books/ => delete all books', function(){   
                     
      test('Test DELETE /api/books/ complete wipe', function(done){
        chai.request(server)
          .delete('/api/books/')
          .send({})
          .end(function(err, res){       
            res.should.have.status(200);
            res.body.should.have.property('message').eql('complete delete successful');        
            done();
          });
          
      });

    });

  });

});
