import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ILogMainState } from '@extras/features/log';
@Component({
  selector: 'app-log-page-count',
  templateUrl: './log-page-count.component.html',
  styleUrls: ['./log-page-count.component.scss']
})
export class LogPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: ILogMainState;
}
