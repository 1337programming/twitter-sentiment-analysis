import {Injectable, Inject, NgZone} from '@angular/core';
const loader = require('webaudio-buffer-loader');

const NOTE_SAMPLES = {
  /*
  C4: require("file!./samples/n_C4.mp3"),
  G4: require("file!./samples/n_G4.mp3"),
  C5: require("file!./samples/n_C5.mp3"),
  D5: require("file!./samples/n_D5.mp3"),
  E5: require("file!./samples/n_E5.mp3"),
  */
};

@Injectable()
export class Samples {
  totalSampleCount = 0;
  loadedSampleCount = 0;
  //noinspection TypeScriptUnresolvedFunction
  private sampleCache = new Map();
  
  constructor(@Inject('audioContext') private audioCtx, private ngZone:NgZone) {
    for (const note of Object.keys(NOTE_SAMPLES)) {
      this.getSample(note);
    }
  }
  
  getSample(note:string) {
    if (!this.sampleCache.has(note)) {
      this.totalSampleCount++;
      this.sampleCache.set(note, new Promise((resolve, reject) => {
        loader(NOTE_SAMPLES[note], this.audioCtx, (err, loadedBuffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(loadedBuffer);
            this.ngZone.run(() => this.loadedSampleCount++);
          }
        });
      }));
    }
    return this.sampleCache.get(note);
  }
  
}
