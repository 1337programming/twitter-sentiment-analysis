import {Component, Inject, HostListener, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Random} from '../../common/services/random.service';
import {Samples} from '../../common/services/samples.service';
import {Chime} from './components/tweet/tweet.component';
import {ForAnyOrder} from '../../common/directives/forAnyOrder.directive';
import 'rxjs/add/operator/bufferTime';
let io = require('socket.io-client');

@Component({
  selector: 'tweets',
  template: `
    <div class="muted-indicator" *ngIf="muted"></div>
    <!--
    <div class="hint click-hint" *ngIf="!clicked && !isDone()">click anywhere</div>
    <div class="hint touch-hint" *ngIf="!clicked && !isDone()">touch anywhere</div>
    -->
    <tweet *forAnyOrder="let tweet of tweets | async"
           [tweet]=tweet>
    </tweet>
  `,
  styles: [require('./views/tweets.css').toString()],
  directives: [Chime, ForAnyOrder]
})
export class Tweets {
  clicks = new Subject<{x: number, y: number, sentiment: any, text: string, topic: string}>();
  noteSampler = this.random.sampler(this.notes);
  tweets = this.clicks.map(({x, y, sentiment, text, topic}) => ({
    x,
    y,
    sentiment,
    text,
    topic,
    note: this.noteSampler(),
    state: 'chiming',
    muted: this.muted
  })).bufferTime(5000, 10);
  
  clicked = false;
  state: string;
  muted: boolean;
  
  private socket: any;
  
  constructor(private random: Random,
              private samples: Samples,
              @Inject('notes') private notes,
              @Inject('audioContext') private audioCtx) {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on('EmitTweet', (tweet) => {
      this.renderTweet(tweet);
    });
  }
  
  renderTweet(tweet) {
    let sentiment = this.samples.sentimentValidator(tweet.sentiment.score);
    this.clicks.next({
      x: Random.getRandomIntInclusive(window.innerWidth * 0.2, (window.innerWidth - (window.innerWidth * 0.2))),
      y: Random.getRandomIntInclusive(window.innerWidth * 0.2, (window.innerHeight - (window.innerHeight * 0.2))),
      sentiment: sentiment,
      text: tweet.text,
      topic: tweet.user.screen_name
    });
  }
  
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.clicked) {
      // unlock audio on ios
      const src = this.audioCtx.createBufferSource();
      src.buffer = this.audioCtx.createBuffer(1, 1, 22050);
      src.connect(this.audioCtx.destination);
      src.start(0);
    }
    this.clicked = true;
    if (!this.isDone()) {
      this.clicks.next({
        x: event.clientX,
        y: event.clientY,
        sentiment: this.random.randomSentiment(),
        text: this.random.randomStatement(),
        topic: 'Default'
      });
    }
  }
  
  isDone() {
    return this.state === 'done';
  }
}
