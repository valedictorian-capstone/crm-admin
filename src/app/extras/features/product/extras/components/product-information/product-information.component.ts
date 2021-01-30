import { Component, Input } from '@angular/core';
import { ProductService, GlobalService } from '@services';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.scss']
})
export class ProductInformationComponent {
  @Input() product: ProductVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  show = true;
  constructor(
    protected readonly service: ProductService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'product', payload: { product: this.product } });
  }
  useUpdateStatus = (status: string) => {
    this.useShowSpinner();
    this.product = { ...this.product };
      this.service.update({
        id: this.product.id,
        status
      } as any)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
  }
  useShowSpinner = () => {
    this.spinner.show('product-information');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-information');
  }
}
