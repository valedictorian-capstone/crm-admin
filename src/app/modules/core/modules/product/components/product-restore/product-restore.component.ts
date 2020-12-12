import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-restore',
  templateUrl: './product-restore.component.html',
  styleUrls: ['./product-restore.component.scss']
})
export class ProductRestoreComponent implements OnDestroy {
  @Output() useDone: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() products: ProductVM[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly productService: ProductService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
  ) { }

  useRestore = (id: string) => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.productService.restore(id)
      .pipe(
        tap((data) => {
          this.useDone.emit(data);
          this.products = this.products.filter((product) => product.id !== id);
          if (this.products.length === 0) {
            this.useClose.emit();
          }
          this.toastrService.success('', 'Restore product successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Restore product fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe()
    );

  }

  useShowSpinner = () => {
    this.spinner.show('product-restore');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-restore');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
