import {Injectable, Inject, NgZone} from '@angular/core';
const loader = require('webaudio-buffer-loader');

const NOTE_SAMPLES = {
  C4: require("file!../../samples/n_C4.mp3"),
  G4: require("file!../../samples/n_G4.mp3"),
  C5: require("file!../../samples/n_C5.mp3"),
  D5: require("file!../../samples/n_D5.mp3"),
  E5: require("file!../../samples/n_E5.mp3"),
  PIANO_C4: require("file!../../samples/piano_C4.mp3"),
  PIANO_G4: require("file!../../samples/piano_G4.mp3"),
  PIANO_C5: require("file!../../samples/piano_C5.mp3"),
  PIANO_D5: require("file!../../samples/piano_D5.mp3"),
  PIANO_E5: require("file!../../samples/piano_E5.mp3"),
  SUN_1: require("file!../../samples/antarctic_sun_1.mp3"),
  SUN_2: require("file!../../samples/antarctic_sun_2.mp3"),
  SUN_3: require("file!../../samples/antarctic_sun_3.mp3"),
  SUN_4: require("file!../../samples/antarctic_sun_4.mp3"),
  SUN_5: require("file!../../samples/antarctic_sun_5.mp3"),
  SUN_6: require("file!../../samples/antarctic_sun_6.mp3"),
  SUN_7: require("file!../../samples/antarctic_sun_7.mp3"),
  SUN_8: require("file!../../samples/antarctic_sun_8.mp3")
  
};

@Injectable()
export class Samples {
  totalSampleCount = 0;
  loadedSampleCount = 0;
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
  
  sentimentValidator(score) {
    enum Color {
      Red,
      Blue,
      Green,
      Alpha
    }
    
    let red:Color = Color.Red;
    let blue:Color = Color.Blue;
    let green:Color = Color.Green;
    let alpha:Color = Color.Alpha;
  
  
    let cap:number = 5;
    let multiplier:number = 255/cap;
    
    if (score > 0) {
      green = 255;
      red = 255 - (score * multiplier);
      blue = 255 - (score * multiplier);
    } else {
      red = 255;
      green = 255 - (Math.abs(score) * multiplier);
      blue = 255 - (Math.abs(score) * multiplier);
    }
    
    alpha = 1;
    
    return {red: Math.round(red), green: Math.round(green), blue: Math.round(blue), alpha: alpha};
    
    /*
    let sentiments = {
      '-1': 'neg-one',
      '-2': 'neg-two',
      '-3': 'neg-three',
      '-4': 'neg-four',
      '-5': 'neg-five',
      '-6': 'neg-six',
      '-7': 'neg-seven',
      '-8': 'neg-eight',
      '-9': 'neg-nine',
      '-10': 'neg-ten',
      '0': 'zero',
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
      '6': 'six',
      '7': 'seven',
      '8': 'eight',
      '9': 'nine',
      '10': 'ten'
    };
    if (sentiments[score.toString()]) {
      return sentiments[score.toString()];
    } else {
      console.log(`${score} was not available on map!`);
      return 'zero';
    }
    */
    
  }
  
}
