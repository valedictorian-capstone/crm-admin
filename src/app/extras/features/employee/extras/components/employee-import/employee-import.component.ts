import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-employee-import',
  templateUrl: './employee-import.component.html',
  styleUrls: ['./employee-import.component.scss']
})
export class EmployeeImportComponent {
  @Input() canImport: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useImport() {
    this.globalService.triggerView$.next({ type: 'employee-import', payload: { } });
  }
}
