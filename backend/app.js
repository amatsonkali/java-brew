// 1. Include Packages
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var cors = require("cors");
var logger = require('morgan');
var redis = require("redis");

// 2. Include Configuration
var config = require('./config');
console.log(`NODE_ENV=${config.NODE_ENV}`);

// 3. Initialize the application 
var app = express();
app.use(cors({
  origin: "*",
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 4. Connect to MongoDB
mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB.');
});

// 5. Initialize redis
const redisPort = 6379
const client = redis.createClient({host: config.HOST_URL, port: redisPort});

client.on("error", (err) => {
  console.log(err);
})


// 6. Load app routes
require('./routes')(app, client);

// 7. Start the server
app.listen(config.LISTEN_PORT, function(){
    console.log('listening on port ' + config.LISTEN_PORT);
});