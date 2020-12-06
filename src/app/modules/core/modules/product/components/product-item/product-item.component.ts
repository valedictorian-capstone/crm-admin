import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { GlobalService, ProductService } from '@services';
import { ProductVM } from '@view-models';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

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
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
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
    this.productService.remove(this.product.id).subscribe(() => {
      this.toastrService.success('', 'Disabled product successful', { duration: 3000 });
    }, () => {
      this.toastrService.success('', 'Disabled product fail', { duration: 3000 });
    });
  }
  useDetail = () => {
    this.router.navigate(['core/product/' + this.product.id]);
  }
}
