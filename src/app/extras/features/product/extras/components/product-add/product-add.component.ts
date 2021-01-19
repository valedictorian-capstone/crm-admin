import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent {
  @Input() canAdd: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'product', payload: { } });
  }
}
