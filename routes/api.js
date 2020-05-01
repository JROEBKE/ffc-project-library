/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

//adding my model
const Book = require('../models/book');

//adding validator
const { check, validationResult } = require('express-validator');

// catch handler
const awaitHandlerFactory = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = function (app) {

  app.route('/api/books')
    .get(     
      awaitHandlerFactory(async function (req, res){   

        //response will be array of book objects query is not used without comments
        let result = await Book.find((err, books) => {            
          if (err){
            console.log(err);
            res.status(500);
          } else {
            console.log('return books');            
            return books;
          }
        })
        //take out comments
        result = result.map(r => ({_id: r.id, title: r.title, commentcount: r.commentcount}));
                
        res.status(200).json(result);
      })
    )
    
    .post(
      [      
        check('title').notEmpty().trim().escape().isLength({max: 100}).withMessage('You have to provide a title with less than 100 chars')        
      ],
      awaitHandlerFactory(async function (req, res){
    
        // validation error handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).send({ message: 'missing required fields', errors: errors.array()});
        }   

        var title = req.body.title;

        const book = new Book({
          title : title,
          commentcount: 0
        })

        var result = await book.save(function (err, book) {
          if (err) return console.error(err);
          console.log("created book "+book._id);
          res.status(201).json(book);
        }); 
        return result;

      })
    )

    .delete(
      awaitHandlerFactory(async function (req, res){       

          let result = await Book.deleteMany({},
            function(err) {
              if (err) {
                console.log('could not delete all books');
                return res.status(500).send({message: 'could not delete all books'});              
              } else {
                console.log('complete delete successful')            
                return res.status(200).send({message: 'complete delete successful'});
              }
            }
          )          
          return result;    
      })
    );



  app.route('/api/books/:id')
    .get(
      awaitHandlerFactory(async function (req, res){
        var bookid = req.params.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).send({ message: 'missing required fields', errors: errors.array()});
        }   
        var result = await Book.findById(bookid, function (err, book) {
          if (err) {
            console.log('could not find '+bookid);               
            return res.status(404).send({message: 'no book exists'});
          } else if(!book) {
            // if returned book is empty then this id does not exist
            console.log('could not find '+bookid);
            return res.status(404).send({message: 'no book exists'});
          } else {
            console.log("returned "+book._id);
            res.status(200).json(book);
          }
        }); 
        return result;
      })
    )

    //update book this should have been done via PUT on book object not via POST but this is as challenge asks
    .post(      
      [      
      check('comment').trim().notEmpty().escape().isLength({max: 100}).withMessage('You have to provide a comment with less than 100 chars'),
      check('id').escape().notEmpty().matches(/^[0-9a-fA-F]{24}$/,"i").withMessage('You have to provide a valid book id')   
      ],
      awaitHandlerFactory(async function (req, res){
        var bookid = req.params.id;        
        var newComment = req.body.comment;

        // validation error handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).send({ message: 'missing required fields', errors: errors.array()});
        }

        //TODO check if correct responses with challenge
        var book = await Book.findById(bookid, function (err, book) {
          if (err) {
            console.log('could not update '+bookid);
            return res.status(500).send({message: 'something went wrong with update of '+bookid});
          } else if (!book) {
            console.log('could not update '+bookid);
            return res.status(404).send({message: 'could not find '+bookid});
          }
        })

        book.comments.push(newComment);
        //console.log(book.comments);
        book.commentcount++;
        //console.log(book.commentcount);

        await book.save ();
      
        return res.status(201).json(book);
      })
    )
    

    .delete( [
      check('id').escape().notEmpty().matches(/^[0-9a-fA-F]{24}$/,"i").withMessage('You have to provide a valid book id')
      ],
      awaitHandlerFactory(async function (req, res){

        // validation error handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).send({ message: 'missing required fields', errors: errors.array()});
        }   
        
        var bookid = req.params.id;

        let result = await Book.findByIdAndDelete({ _id: bookid },
          function(err, book) {
            if (err) {
              console.log('could not delete '+bookid);
              return res.status(500).send({message: 'could not delete '+bookid});
            } else if(!book) {
              // if returned book is empty then this id does not exist
              console.log('could not delete '+bookid);
              return res.status(404).send({message: 'could not delete '+bookid});
            } else {
              console.log('deleted '+bookid)            
              return res.status(200).send({message: 'delete successful', book});
            }
          }
        )          
        return result;    
      })
    )  
}
