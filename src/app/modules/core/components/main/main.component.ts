import { Component, EventEmitter, OnInit, Output, OnChanges } from '@angular/core';
import { LoadingService } from '@services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {
  status = false;
  @Output() useClickOutside: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    protected readonly loadingService: LoadingService,
    protected readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadingService.loadingSubject$.subscribe((data) => {
      this.status = data;
    });
  }
  ngOnChanges() {
    console.log(this.activatedRoute);
  }
}
