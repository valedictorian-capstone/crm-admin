import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";
import * as Hammer from 'hammerjs';

@Injectable({
  providedIn: 'root'
})
export class HammerConfig extends HammerGestureConfig {
  // tslint:disable-next-line: no-angle-bracket-type-assertion
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL }
  };
}
