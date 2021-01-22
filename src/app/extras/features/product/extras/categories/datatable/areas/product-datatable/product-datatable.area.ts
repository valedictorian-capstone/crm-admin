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
  selector: 'app-product-datatable',
  templateUrl: './product-datatable.area.html',
  styleUrls: ['./product-datatable.area.scss']
})
export class ProductDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, product: ProductVM}[]> = new EventEmitter<{formControl: FormControl, product: ProductVM}[]>();
  checkList: { formControl: FormControl, product: ProductVM }[] = [];
  headerCheck = new FormControl('off');
  @Input() state: IProductMainState;
  @Input() sort: ISort;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ProductService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('off');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((product) => ({
      product,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'on';
      this.checkList = this.state.paginationArray.map((product) => ({
        product,
        formControl: new FormControl(value),
      }))
    } else {
      const size = this.checkList.filter((e) => e.formControl.value).length;
      this.headerCheck.setValue(size > 0 ? (size === this.checkList.length ? 'on' : 'indeterminate') : 'off');
    }
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string) {
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
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
