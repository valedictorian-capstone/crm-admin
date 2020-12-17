import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnDestroy } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { CustomerService, GlobalService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-lead-item',
  templateUrl: './lead-item.component.html',
  styleUrls: ['./lead-item.component.scss']
})
export class LeadItemComponent implements OnDestroy {
  @Input() customer: CustomerVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() search: string;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly customerService: CustomerService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: { customer: this.customer } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.customer } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useToggleState = () => {
    this.useShowSpinner();
    const subscription = (!this.customer.isDelete
      ? this.customerService.disabled(this.customer.id)
      : this.customerService.restore(this.customer.id))
      .pipe(
        tap((data) => {
          this.customer.isDelete = !this.customer.isDelete;
          this.toastrService.success('', !this.customer.isDelete
            ? 'Disabled customer successful' : 'Active customer successful', { duration: 3000 });
        }),
        catchError((err) => {
          console.log(err);
          this.toastrService.danger('', (!this.customer.isDelete
            ? 'Disabled customer fail! ' : 'Active customer fail! ') + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  useShowSpinner = () => {
    this.spinner.show('lead-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('lead-main');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
