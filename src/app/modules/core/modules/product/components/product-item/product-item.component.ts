import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { GlobalService, ProductService } from '@services';
import { ProductVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnDestroy {
  @Input() product: ProductVM;
  @Input() search: string;
  @Input() canUpdate: boolean;
  @Input() canRemove: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly productService: ProductService,
    protected readonly dialogService: NbDialogService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {

  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'product', payload: { product: this.product } });
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    const subscription = this.productService.remove(this.product.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Disabled product successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Disabled product fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDetail = () => {
    this.router.navigate(['core/product/' + this.product.id]);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
