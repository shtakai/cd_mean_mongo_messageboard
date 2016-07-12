const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

const app = express();


// bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// mongoose connect to mongodb
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
var Message = mongoose.model('Message', MessageSchema );
var Comment = mongoose.model('Comment', CommentSchema);


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');




app.get('/', function(req, res){
  console.log('get /');
  Message.find({}).
    sort({createdAt: -1}).
    populate('comments').
    exec(function(err, _messages){
      if(err){
        console.log('err', err);
        res.json(err);
      } else {
        console.log('get message');
        res.render('index', {messages: _messages});
      }
    })
})

app.post('/messages', function(req, res){
  console.log('post /messages');
  console.log('body', req.body);
  let message = new Message(req.body);
  console.log(`message: ${message}`);
  message.save(function(err, _message){
    if(err){
      console.log('error', err);
      res.json(err);
    }else{
      console.log('saved', _message);
      res.redirect('/');
    }
  });
})

app.post('/messages/:id/comments', function(req, res){
  console.log('post /m/id/comments');
  console.log('req.body', req.body);
  // grab one message
  Message.findOne({_id: req.params.id}, function(err, message){
    if(err){
      console.log('error',err);
      res.json(err);
    } else {
      console.log(`message: ${message}`);
      let comment = new Comment(req.body);
      comment.save(function(err){
        message.comments.push(comment);
        message.save(function(err){
          if(err){
            console.log('err', err);
            res.json(err);
          }else{
            console.log('comment/message okay okok');
            console.log(`comment_id:${comment._id}`);
            console.log(`message_id:${message._id}`);
            res.redirect('/');
          }
        });
      });
    }
  });
})



const server = app.listen(8000, function(){
  console.log('SERVER #8000');
})
