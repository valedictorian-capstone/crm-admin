import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAttachmentSearch } from '@extras/features/attachment';

@Component({
  selector: 'app-attachment-query',
  templateUrl: './attachment-query.component.html',
  styleUrls: ['./attachment-query.component.scss']
})
export class AttachmentQueryComponent {
  @Input() search: IAttachmentSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<IAttachmentSearch> = new EventEmitter<IAttachmentSearch>();
  useClear = () => {
    this.search = {
      name: undefined,
      campaign: undefined,
      deal: undefined,
    };
    this.useSearch.emit(this.search);
  }
}
