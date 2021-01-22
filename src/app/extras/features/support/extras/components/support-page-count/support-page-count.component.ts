import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-support-page-count',
  templateUrl: './support-page-count.component.html',
  styleUrls: ['./support-page-count.component.scss']
})
export class SupportPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<number> = new EventEmitter<number>();
  @Input() pageCount: number = 20;
  @Input() active: number = 1;
  @Input() length: number = 0;
  @Input() variable: string = '';
}
