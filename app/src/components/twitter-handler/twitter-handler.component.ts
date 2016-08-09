import {Component, Inject, HostListener, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {ForAnyOrder} from './directives/forAnyOrder.directive';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/map';

import {Random} from '../../common/services/random.service';
import {SocketClient} from '../../common/services/socket-client.service';
import {Samples} from '../../common/services/samples.service';
import {Tweet} from '../tweet/tweet.component';

@Component({
  selector: 'twitter-handler',
  template: `
    <div class="muted-indicator" *ngIf="muted"></div>
    <div class="hint click-hint" *ngIf="!clicked && !isDone()">click anywhere</div>
    <div class="hint touch-hint" *ngIf="!clicked && !isDone()">touch anywhere</div>
    <tweet *forAnyOrder="let tweet of tweets | async"
           [tweet]=tweet>
    </tweet>
  `,
  styles: [require('./views/twitter-handler.css').toString()],
  directives: [Tweet, ForAnyOrder]
})
export class TwitterHandler {
  clicks = new Subject<{x: number, y: number}>();
  noteSampler = this.random.sampler(this.notes);
  tweets = this.clicks.map(({x, y}) => ({
    x,
    y,
    note: this.noteSampler(),
    text: this.random.randomStatement(),
    topic: 'Tmobile',
    sentiment: this.random.randomSentiment(),
    state: 'tweeting',
    muted: this.muted
  })).bufferTime(5000, 10);
  
  clicked = false;
  state: string;
  muted: boolean;
  
  constructor(private random: Random,
              private client: SocketClient,
              private samples: Samples,
              @Inject('notes') private notes,
              @Inject('audioContext') private audioCtx) {
    client.controlEvents().subscribe(state => {
      this.state = state.state;
      this.muted = state.muted;
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
      this.clicks.next({x: event.clientX, y: event.clientY});
    }
  }
  
  isDone() {
    return this.state === 'done';
  }
}
