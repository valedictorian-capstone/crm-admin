import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { CustomerService, GlobalService } from '@services';
import { CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-customer-datatable-item',
  templateUrl: './customer-datatable-item.component.html',
  styleUrls: ['./customer-datatable-item.component.scss']
})
export class CustomerDatatableItemComponent implements OnDestroy {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() customer: CustomerVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() search: string;
  @Input() stage: string;
  @Input() isMain: boolean;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  form: FormGroup;
  exist = {
    email: false,
    phone: false,
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: CustomerService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'customer', payload: { customer: this.customer, for: 'customer' } });
  }
  useView() {
    this.router.navigate(['core/customer/' + this.customer.id]);
  }
  usePhone = () => {
    window.open('tel:' + this.customer.phone, '_self');
  }
  useMail = () => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email: this.customer.email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useOpen = (link: string) => {
    window.open(link, '_blank');
  }
  useDeal = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: { customer: this.customer } });
  }
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
  useRenderGroup = () => {
    return this.customer.groups.map((e) => e.name).join(',');
  }
  useSkype = () => {
    window.open('skype:' + this.customer.skypeName + '?chat', '_self');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
