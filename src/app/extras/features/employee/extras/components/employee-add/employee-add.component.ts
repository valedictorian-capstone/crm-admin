import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  @Input() canAdd: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'employee', payload: { } });
  }
}
