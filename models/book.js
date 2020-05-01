const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  bodyParser = require('body-parser');

const bookSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  commentcount: {
  	type: Number
  },
  comments: {
    type : Array ,
    "default" : []
  },
});


// create the model
var bookModel = mongoose.model('Book', bookSchema);

// export the model
module.exports = bookModel;
