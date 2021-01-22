import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NbCalendarWithTimeComponent } from '@nebular/theme/components/datepicker/calendar-with-time.component';
@Component({
  selector: 'app-support-date-time',
  templateUrl: './support-date-time.component.html',
  styleUrls: ['./support-date-time.component.scss']
})
export class SupportDateTimeComponent implements AfterViewInit {
  @Output() useChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;
  @ViewChild('calendar') calendar: NbCalendarWithTimeComponent<Date>;
  constructor(
    protected readonly cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    if (this.min && this.max) {
      this.calendar.onDateValueChange(this.date);
      this.calendar?.timepicker?.saveValue();
      this.cdr.detectChanges();
    }
  }
}
