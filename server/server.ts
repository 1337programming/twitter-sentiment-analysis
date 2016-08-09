declare let require: any;

import {StreamEmitter} from './src/stream-emitter';
import {TwitterStream} from './src/twitter-stream'

let Twitter = require('twitter');
let sentiment = require('sentiment');

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let streamEmitter = new StreamEmitter();
let twitterStream = new TwitterStream(streamEmitter);

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  let subcription = streamEmitter.listen('Tweet', (tweet) => {
    //console.log('TWEET', tweet);
    console.log(`${new Date()}: Tweet ${tweet}`);
    io.emit('EmitTweet', tweet);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    subcription.dispose();
  });
  
  socket.on('tweet', function (msg) {
    console.log('message: ' + msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
