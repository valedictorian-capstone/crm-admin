import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ICategoryMainState } from '@extras/features/category';
@Component({
  selector: 'app-category-page-count',
  templateUrl: './category-page-count.component.html',
  styleUrls: ['./category-page-count.component.scss']
})
export class CategoryPageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: ICategoryMainState;
}
