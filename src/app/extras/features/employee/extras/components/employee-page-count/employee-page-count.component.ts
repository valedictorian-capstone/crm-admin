import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IEmployeeMainState } from '@extras/features/employee';

@Component({
  selector: 'app-employee-page-count',
  templateUrl: './employee-page-count.component.html',
  styleUrls: ['./employee-page-count.component.scss']
})
export class EmployeePageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: IEmployeeMainState;
}
