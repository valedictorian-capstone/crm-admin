import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryService } from '@services';
import { CategoryVM } from '@view-models';

@Component({
  selector: 'app-reuse-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<CategoryVM> = new EventEmitter<CategoryVM>();
  @Input() template: HTMLElement;
  @Input() selected: CategoryVM;
  value = '';
  categorys: CategoryVM[] = [];
  filterCategorys: CategoryVM[] = [];
  stage = 'finding';
  constructor(
    protected readonly categoryService: CategoryService,
  ) { }
  ngOnInit() {
    this.categoryService.findAll().subscribe((data) => {
      this.categorys = data;
      setTimeout(() => {
        this.stage = 'done';
        this.filterCategorys = data;
      }, 500);
    });
  }
  useChangeValue = (value: string) => {
    this.stage = 'finding';
    setTimeout(() => {
      this.value = value;
      this.filterCategorys = this.categorys.filter((category) => category.name.toLowerCase().includes(value.toLowerCase()));
      this.stage = 'done';
    }, 500);
  }
  usePlus = () => {
    this.categoryService.insert({ name: this.value }).subscribe((data) => {
      this.categorys.push(data);
      this.useSelect.emit(data);
      this.useChangeValue('');
    });
  }
}
