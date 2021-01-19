import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDealMainState } from '@extras/features/deal';

@Component({
  selector: 'app-deal-page-count',
  templateUrl: './deal-page-count.component.html',
  styleUrls: ['./deal-page-count.component.scss']
})
export class DealPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: IDealMainState;
}
