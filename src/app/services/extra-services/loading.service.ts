import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public readonly loadingSubject$ = new Subject<boolean>();
  constructor() { }

  destroy = () => {
    this.loadingSubject$.unsubscribe();
  }
  next = (status: boolean) => {
    this.loadingSubject$.next(status);
  }
}
