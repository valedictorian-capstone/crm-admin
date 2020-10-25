import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingService } from '@services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  status = false;
  @Output() useClickOutside: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    protected readonly loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loadingService.loadingSubject$.subscribe((data) => {
      this.status = data;
    });
  }

  ngOnDestroy() {
    this.loadingService.destroy();
  }
}
