import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';
@Component({
  selector: 'app-customer-import',
  templateUrl: './customer-import.component.html',
  styleUrls: ['./customer-import.component.scss']
})
export class CustomerImportComponent {
  @Input() canImport: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useImport() {
    this.globalService.triggerView$.next({ type: 'customer-import', payload: { } });
  }
}
