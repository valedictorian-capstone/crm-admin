import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IActivityMainState } from '@extras/features/activity';

@Component({
  selector: 'app-activity-page-count',
  templateUrl: './activity-page-count.component.html',
  styleUrls: ['./activity-page-count.component.scss']
})
export class ActivityPageCountComponent{
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: IActivityMainState;
}
