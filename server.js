const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

const app = express();



mongoose.connect('mongodb://localhost/dojo_message_board_development');

// Schema
const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4
  },
  text: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
},{
  timestamps: true
});

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4
  },
  text: {
    type: String,
    required: true
  },
  _message: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
},{
  timestamps: true
});

// register
mongoose.model('Message', MessageSchema );
mongoose.model('Comment', CommentSchema);


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');




app.get('/', function(req, res){
  console.log('get /');
  res.render('index');
})

app.post('/messages', function(req, res){
  console.log('post /messages');
  console.log('body', req.body);
  res.send('---');
})



const server = app.listen(8000, function(){
  console.log('SERVER #8000');
})
