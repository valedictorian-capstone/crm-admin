import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deal-type',
  templateUrl: './deal-type.component.html',
  styleUrls: ['./deal-type.component.scss']
})
export class DealTypeComponent {
  @Input() type: 'datatable' | 'card' | 'kanban';
  @Output() typeChange: EventEmitter<'datatable' | 'card' | 'kanban'> = new EventEmitter<'datatable' | 'card' | 'kanban'>();
}
