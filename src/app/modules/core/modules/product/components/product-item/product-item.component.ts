import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { GlobalService, ProductService } from '@services';
import { ProductVM } from '@view-models';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: ProductVM;
  @Input() search: string;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly productService: ProductService,
    protected readonly dialogService: NbDialogService,
  ) {

  }

  ngOnInit() {
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'product', payload: { product: this.product } });
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.productService.remove(this.product.id).subscribe(() =>
      this.productService.triggerValue$.next({ type: 'remove', data: this.product })
    );
  }
}
