import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-log-type',
  templateUrl: './log-type.component.html',
  styleUrls: ['./log-type.component.scss']
})
export class LogTypeComponent {
  @Input() type: 'datatable' | 'card';
  @Output() typeChange: EventEmitter<'datatable' | 'card'> = new EventEmitter<'datatable' | 'card'>();
}
