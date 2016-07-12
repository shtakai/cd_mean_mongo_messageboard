const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

const app = express();






const server = app.listen(8000, function(){
  console.log('SERVER #8000');
})
