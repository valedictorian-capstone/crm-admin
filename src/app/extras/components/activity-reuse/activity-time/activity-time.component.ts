import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NbCalendarWithTimeComponent } from '@nebular/theme/components/datepicker/calendar-with-time.component';

@Component({
  selector: 'app-reuse-activity-time',
  templateUrl: './activity-time.component.html',
  styleUrls: ['./activity-time.component.scss']
})
export class ActivityTimeComponent implements OnInit, AfterViewInit {
  @Output() useChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() date: Date;
  @ViewChild('calendar') calendar: NbCalendarWithTimeComponent<Date>;
  constructor(
    protected readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.calendar.onDateValueChange(this.date);
    this.calendar?.timepicker?.saveValue();
    this.cdr.detectChanges();
  }
}
