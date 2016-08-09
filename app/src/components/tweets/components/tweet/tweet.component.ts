import {Component, Inject, Input, OnInit, OnDestroy, trigger, transition, animate, style, group} from '@angular/core';
import {Samples} from '../../../../common/services/samples.service';
import {Audio} from '../../../../common/services/audio.service';

@Component({
  selector: 'tweet',
  template: `
    <div class="ring {{tweet.sentiment}}" @expand="any"
         [style.left.px]="tweet.x - 300"
         [style.top.px]="tweet.y - 300">
         <div class="message"><h3>{{tweet.topic}}</h3><br><br>{{tweet.text}}</div>
    </div>
    <div class="light" @flash="any"
         [style.left.px]="tweet.x - 300"
         [style.top.px]="tweet.y - 300">
    </div>
  `,
  styles: [require('./views/tweet.css').toString()],
  animations: [
    trigger('expand', [
      transition('void => *', [
        style({opacity: 1, transform: 'scale3d(.1,.1,.1) translateZ(0)'}),
        group([
          animate('5s',
            style({opacity: 0})),
          animate('5s cubic-bezier(0,.79,.13,.71)',
            style({transform: 'scale3d(1,1,1) translateZ(0)'}))
        ])
      ])
    ]),
    trigger('flash', [
      transition('void => *', [
        style({opacity: 1, transform: 'scale3d(.1,.1,.1) translateZ(0)'}),
        animate('0.05s ease-in',
          style({opacity: 1, transform: 'scale3d(1,1,1) translateZ(0)'})
        ),
        animate('1s ease-out',
          style({opacity: 0, transform: 'scale3d(0,0,0) translateZ(0)'})
        )
      ])
    ])
  ]
})
export class Chime implements OnInit, OnDestroy {
  @Input() tweet:{x: number, y: number, note: string, text: string, sentiment: string, topic: string};
  stopAudio:Function;
  
  constructor(private samples:Samples,
              private audio:Audio,
              @Inject('size') private size) {
  }
  
  ngOnInit() {
    // this.samples.getSample(this.tweet.note).then(sample => {
    //   this.stopAudio = this.audio.play(sample, (this.tweet.x / this.size.width) * 2 - 1);
    // });
  }
  
  ngOnDestroy() {
    // if (this.stopAudio) {
    //   this.stopAudio();
    // }
  }
  
}
