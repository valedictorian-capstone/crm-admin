import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public readonly triggerView$ = new Subject<{ type: string, payload: any }>();
  constructor() { }

}
