import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IProductMainState } from '@extras/features/product';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.area.html',
  styleUrls: ['./product-card.area.scss']
})
export class ProductCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, product: ProductVM}[]> = new EventEmitter<{formControl: FormControl, product: ProductVM}[]>();
  checkList: {formControl: FormControl, product: ProductVM}[] = [];
  @Input() state: IProductMainState;
  @Input() sort: ISort;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ProductService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.checkList = this.state.paginationArray.map((product) => ({
      product,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck() {
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string, length: number) {
    if (length === 0) {
      const rs = await swal.fire({
        title: 'Remove an product?',
        text: 'When you click OK button, an product will be remove out of system and can not backup',
        showCancelButton: true,
      });
      if (rs.isConfirmed) {
        const subscription = this.service.remove(id)
          .pipe(
            tap((data) => {
              this.toastrService.success('', 'Remove product successful', { duration: 3000 });
            }),
            catchError((err) => {
              this.toastrService.danger('', 'Remove product fail! ' + err.message, { duration: 3000 });
              return of(undefined);
            })
          ).subscribe(console.log);
        this.subscriptions.push(subscription);
      }
    } else {
      swal.fire('Can not remove this product', '', 'error');
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
