import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEmployeeSearch } from '@extras/features/employee';

@Component({
  selector: 'app-employee-query',
  templateUrl: './employee-query.component.html',
  styleUrls: ['./employee-query.component.scss']
})
export class EmployeeQueryComponent {
  @Input() search: IEmployeeSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<IEmployeeSearch> = new EventEmitter<IEmployeeSearch>();
  useClear = () => {
    this.search = {
      value: '',
    };
    this.useSearch.emit(this.search);
  }
}
