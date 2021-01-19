import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IAttachmentMainState } from '@extras/features/attachment';

@Component({
  selector: 'app-attachment-page-count',
  templateUrl: './attachment-page-count.component.html',
  styleUrls: ['./attachment-page-count.component.scss']
})
export class AttachmentPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: IAttachmentMainState;
}
