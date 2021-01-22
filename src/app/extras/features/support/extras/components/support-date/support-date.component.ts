import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-support-date',
  templateUrl: './support-date.component.html',
  styleUrls: ['./support-date.component.scss']
})
export class SupportDateComponent {
  @Output() useChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;
}
