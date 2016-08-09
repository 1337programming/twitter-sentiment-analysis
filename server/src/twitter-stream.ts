declare let require: any;

let Twitter = require('twitter');
let sentiment = require('sentiment');
let swearJar = require('swearjar');
let API = require('./api-management.json');

let streamingTerm = API.streaming_term;

export class TwitterStream {
  
  public client: any;
  private emitter:any;
  
  constructor(_emitter:any) {
    this.emitter = _emitter;
    this.client = new Twitter(API);
    this.stream();
  }
  
  private stream() {
    this.client.stream('statuses/filter', {track: streamingTerm}, (stream) => {
      stream.on('data', (tweet) => {
        //console.log([tweet.text, new Date()]);
        tweet['sentiment'] = sentiment(tweet.text);
        tweet['created_at'] = new Date();
        if (swearJar.profane(tweet.text)) {
          tweet.text = swearJar.censor(tweet.text);
        }
        this.emitter.notifyTweet(tweet);
        //epoch_millis | getTime()
      });
      
      stream.on('error', function (error) {
        console.log(error);
      });
    });
  }
  
}
