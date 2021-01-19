import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-activity-type',
  templateUrl: './activity-type.component.html',
  styleUrls: ['./activity-type.component.scss']
})
export class ActivityTypeComponent {
  @Input() type: 'datatable' | 'card' | 'calendar';
  @Output() typeChange: EventEmitter<'datatable' | 'card' | 'calendar'> = new EventEmitter<'datatable' | 'card' | 'calendar'>();
}
