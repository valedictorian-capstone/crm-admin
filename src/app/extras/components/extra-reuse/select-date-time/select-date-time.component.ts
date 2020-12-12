import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NbCalendarWithTimeComponent } from '@nebular/theme/components/datepicker/calendar-with-time.component';

@Component({
  selector: 'app-reuse-select-date-time',
  templateUrl: './select-date-time.component.html',
  styleUrls: ['./select-date-time.component.scss']
})
export class SelectDateTimeComponent implements OnInit, AfterViewInit {
  @Output() useChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;
  @ViewChild('calendar') calendar: NbCalendarWithTimeComponent<Date>;
  constructor(
    protected readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    if (this.min && this.max) {
      this.calendar.onDateValueChange(this.date);
      this.calendar?.timepicker?.saveValue();
      this.cdr.detectChanges();
    }
  }
}
