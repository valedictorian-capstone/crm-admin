import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-attachment-type',
  templateUrl: './attachment-type.component.html',
  styleUrls: ['./attachment-type.component.scss']
})
export class AttachmentTypeComponent {
  @Input() type: 'datatable' | 'card';
  @Output() typeChange: EventEmitter<'datatable' | 'card'> = new EventEmitter<'datatable' | 'card'>();
}
