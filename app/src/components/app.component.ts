import {Component, Inject, provide} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {LoadingIndicator} from './loader-indicator/loader-indicator.component';
import {TwitterHandler} from './twitter-handler/twitter-handler.component';
import {SocketClient} from '../common/services/socket-client.service';
import {Random} from '../common/services/random.service';
import {Samples} from '../common/services/samples.service';
import {Audio} from '../common/services/audio.service';

@Component({
  selector: 'twitter-sentiment',
  template: `
    <div (window:resize)="onWindowResize()">
      <router-outlet [hidden]="isLoading()"></router-outlet>
      <loading-indicator *ngIf="isLoading()" [progress]="getLoadProgress()"></loading-indicator>
    </div>
  `,
  styles: [''],
  directives: [ROUTER_DIRECTIVES, LoadingIndicator],
  providers: [
    SocketClient,
    Random,
    Samples,
    Audio,
    {provide:'audioContext', useValue: new (window['AudioContext'] || window['webkitAudioContext'])},
    {provide:'size', useValue: {useValue: {width: 1280, height: 780}}},
    {provide:'notes', useValue: {useValue: ['C4', 'G4', 'C5', 'D5', 'E5']}},
  ]
})
export class AppComponent {
  bufferLoaded = false;
  constructor(@Inject('size') private size, private samples:Samples) {
    this.onWindowResize();
    setTimeout(() => this.bufferLoaded = true, 4200);
  }
  onWindowResize() {
    this.size.width = window.innerWidth;
    this.size.height = window.innerHeight;
  }
  getLoadProgress() {
    const bfrCount = this.bufferLoaded ? 1 : 0;
    return 100 * (this.samples.loadedSampleCount + bfrCount) / (this.samples.totalSampleCount + 1);
  }
  isLoading() {
    return this.getLoadProgress() < 100;
  }
}
