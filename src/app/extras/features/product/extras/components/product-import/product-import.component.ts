import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss']
})
export class ProductImportComponent {
  @Input() canImport: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useImport() {
    this.globalService.triggerView$.next({ type: 'product-import', payload: { } });
  }
}
