import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Injectable({
  providedIn: 'root'
})
export class HammerjsConfigService extends HammerGestureConfig {
  overrides: any = {
    'pan': { direction: Hammer.DIRECTION_ALL },
    'swipe': { direction: Hammer.DIRECTION_ALL }
  };
}
