import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, Validators } from '@angular/forms';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-cate',
  templateUrl: './product-cate.component.html',
  styleUrls: ['./product-cate.component.scss']
})
export class ProductCateComponent {
  @Input() product: ProductVM;
  @Input() canUpdate: boolean;
  control = new FormControl(undefined, [Validators.required]);
  show = true;
  showChange = false;
  constructor(
    protected readonly service: ProductService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  useChange() {
    if (this.control.valid) {
      this.useShowSpinner();
      this.service.update({ id: this.product.id, category: { id: this.control.value.id } } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change category successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change category fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.control.setValue(undefined);
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select category!', '', 'warning')
    }
  }
  useShowSpinner = () => {
    this.spinner.show('product-category');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-category');
  }
}
