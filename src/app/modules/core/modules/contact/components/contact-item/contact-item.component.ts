import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { CustomerService, GlobalService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss']
})
export class ContactItemComponent implements OnInit {
  @Input() customer: CustomerVM;
  @Input() search: string;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly customerService: CustomerService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
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
    (!this.customer.isDelete
      ? this.customerService.disabled(this.customer.id)
      : this.customerService.restore(this.customer.id))
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.customer.isDelete = !this.customer.isDelete;
        this.toastrService.success('', 'Disabled customer successful', { duration: 3000 });
      }, (err) => {
        this.toastrService.danger('', 'Disabled customer fail', { duration: 3000 });
      });
  }
  useShowSpinner = () => {
    this.spinner.show('contact-item-' + this.customer.id);
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('contact-item-' + this.customer.id);
    }, 1000);
  }
}
