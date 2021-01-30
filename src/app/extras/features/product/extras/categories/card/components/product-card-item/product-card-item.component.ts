import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ProductService, GlobalService } from '@services';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-product-card-item',
  templateUrl: './product-card-item.component.html',
  styleUrls: ['./product-card-item.component.scss']
})
export class ProductCardItemComponent {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() product: ProductVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  show = true;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: ProductService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  useView() {
    this.router.navigate(['core/product/' + this.product.id]);
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'product', payload: { product: this.product} });
  }
  useCopy(data: string) {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
