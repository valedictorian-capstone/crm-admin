import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AccountVM, CustomerVM } from '@view-models';
import { CustomerService, GlobalService } from '@services';
import { DatePipe } from '@angular/common';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-reuse-customer-profile',
  templateUrl: './customer-profile.page.html',
  styleUrls: ['./customer-profile.page.scss']
})
export class CustomerProfilePage implements OnInit {
  @Input() customer: CustomerVM;
  @Input() you: AccountVM;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  env = 'desktop';
  visible = false;
  constructor(
    protected readonly customerService: CustomerService,
    protected readonly datePipe: DatePipe,
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly spinner: NgxSpinnerService,
    protected readonly deviceService: DeviceDetectorService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
    this.useReload();
  }
  useReload = () => {
    this.useShowSpinner();
    this.customerService
      .findById(this.customer.id)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => this.customer = data);
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: { customer: this.customer } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useOpen = (link: string) => {
    window.open(link, '_blank');
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useShowSpinner = () => {
    this.spinner.show('customer-profile');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('customer-profile');
    }, 1000);
  }
}
